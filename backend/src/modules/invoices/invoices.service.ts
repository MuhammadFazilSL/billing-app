import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InventoryService } from '../inventory/inventory.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private loyaltyService: LoyaltyService,
    private usageService: UsageService
  ) {}

  async create(tenantId: string, userId: string, createInvoiceDto: CreateInvoiceDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Generate Invoice Number (e.g., INV-20260716-000001)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.invoice.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          }
        }
      });
      const seq = String(countToday + 1).padStart(6, '0');
      const invoiceNumber = `INV-${dateStr}-${seq}`;

      // 2. Validate items
      if (!createInvoiceDto.items || createInvoiceDto.items.length === 0) {
        throw new BadRequestException('Invoice must have at least one item');
      }

      // 3. Create the Invoice
      const invoice = await tx.invoice.create({
        data: {
          tenantId,
          invoiceNumber,
          customerId: createInvoiceDto.customerId,
          subTotal: createInvoiceDto.subTotal,
          discountAmount: createInvoiceDto.discountAmount || 0,
          taxAmount: createInvoiceDto.taxAmount,
          grandTotal: createInvoiceDto.grandTotal,
          amountPaid: createInvoiceDto.amountPaid,
          balanceDue: createInvoiceDto.grandTotal - createInvoiceDto.amountPaid,
          paymentStatus: createInvoiceDto.paymentStatus,
          paymentMethod: createInvoiceDto.paymentMethod || 'CASH',
          status: 'COMPLETED',
          userId,
          notes: createInvoiceDto.notes,
          couponCode: createInvoiceDto.couponCode,
          loyaltyRedeemed: createInvoiceDto.loyaltyRedeemed,
          discountDetails: createInvoiceDto.discountDetails || {},
        }
      });

      // 4. Create Invoice Items
      const invoiceItemsData = createInvoiceDto.items.map(item => ({
        tenantId,
        invoiceId: invoice.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unitCost: item.unitCost || 0,
        taxRate: item.taxRate || 0,
        taxAmount: item.taxAmount || 0,
        discountAmount: item.discountAmount || 0,
        totalAmount: item.totalAmount,
      }));

      await tx.invoiceItem.createMany({
        data: invoiceItemsData,
      });

      // 5. Create Payment Record if amount > 0
      if (createInvoiceDto.amountPaid > 0) {
        await tx.invoicePayment.create({
          data: {
            tenantId,
            invoiceId: invoice.id,
            paymentMethod: createInvoiceDto.paymentMethod,
            amount: createInvoiceDto.amountPaid,
          }
        });
      }

      // 6. Record Sale in Inventory (Reduces Stock)
      await this.inventoryService.recordSale(tx, tenantId, userId, invoice.id, invoiceItemsData);

      // 7. Update Customer last purchase, redeem loyalty, earn loyalty
      if (createInvoiceDto.customerId) {
        await tx.customer.update({
          where: { id: createInvoiceDto.customerId },
          data: { lastPurchaseDate: new Date() }
        });

        if (createInvoiceDto.loyaltyRedeemed && createInvoiceDto.loyaltyRedeemed > 0) {
          await this.loyaltyService.redeemPoints(
            tenantId, 
            createInvoiceDto.customerId, 
            createInvoiceDto.loyaltyRedeemed, 
            invoice.id, 
            'Redeemed on invoice', 
            tx
          );
        }

        await this.loyaltyService.earnPoints(tx, tenantId, createInvoiceDto.customerId, invoice.id, createInvoiceDto.grandTotal);
      }

      await this.usageService.incrementInvoices(tenantId);

      return invoice;
    });
  }

  async findAll(tenantId: string, page = 1, limit = 50, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { tenantId, deletedAt: null };
    
    if (search) {
      whereClause.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: whereClause,
        include: { customer: { select: { name: true } }, user: { select: { firstName: true, lastName: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where: whereClause })
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        invoiceItems: true,
        payments: true,
        customer: true,
        user: { select: { firstName: true, lastName: true } }
      }
    });
    
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }
}
