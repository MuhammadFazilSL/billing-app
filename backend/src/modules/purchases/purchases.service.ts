import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService
  ) {}

  async create(tenantId: string, userId: string, createPurchaseDto: CreatePurchaseDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Generate Purchase Number (e.g., PO-20260716-000001)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.purchase.count({
        where: {
          tenantId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          }
        }
      });
      const seq = String(countToday + 1).padStart(6, '0');
      const purchaseNumber = `PO-${dateStr}-${seq}`;

      if (!createPurchaseDto.items || createPurchaseDto.items.length === 0) {
        throw new BadRequestException('Purchase must have at least one item');
      }

      // 2. Create the Purchase
      const purchase = await tx.purchase.create({
        data: {
          tenantId,
          purchaseNumber,
          supplierId: createPurchaseDto.supplierId,
          subTotal: createPurchaseDto.subTotal,
          discountAmount: createPurchaseDto.discountAmount || 0,
          taxAmount: createPurchaseDto.taxAmount,
          grandTotal: createPurchaseDto.grandTotal,
          amountPaid: createPurchaseDto.amountPaid,
          balanceDue: createPurchaseDto.grandTotal - createPurchaseDto.amountPaid,
          paymentStatus: createPurchaseDto.paymentStatus,
          paymentMethod: createPurchaseDto.paymentMethod,
          status: 'COMPLETED',
          userId,
          notes: createPurchaseDto.notes,
        }
      });

      // 3. Create Purchase Items
      const purchaseItemsData = createPurchaseDto.items.map(item => ({
        tenantId,
        purchaseId: purchase.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitCost: item.unitCost,
        taxRate: item.taxRate || 0,
        taxAmount: item.taxAmount || 0,
        discountAmount: item.discountAmount || 0,
        totalAmount: item.totalAmount,
      }));

      await tx.purchaseItem.createMany({
        data: purchaseItemsData,
      });

      // 4. Record Purchase in Inventory (Increases Stock)
      await this.inventoryService.recordPurchase(tx, tenantId, userId, purchase.id, purchaseItemsData);

      return purchase;
    });
  }

  async findAll(tenantId: string, page = 1, limit = 50, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { tenantId, deletedAt: null };
    
    if (search) {
      whereClause.OR = [
        { purchaseNumber: { contains: search, mode: 'insensitive' } },
        { supplier: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where: whereClause,
        include: { supplier: { select: { companyName: true } }, user: { select: { firstName: true, lastName: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchase.count({ where: whereClause })
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const purchase = await this.prisma.purchase.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        purchaseItems: true,
        supplier: true,
        user: { select: { firstName: true, lastName: true } }
      }
    });
    
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }
}
