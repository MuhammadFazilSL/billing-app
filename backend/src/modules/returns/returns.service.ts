import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ReturnsService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService
  ) {}

  async createReturn(tenantId: string, userId: string, returnType: 'SALES_RETURN' | 'PURCHASE_RETURN', createReturnDto: CreateReturnDto) {
    return this.prisma.$transaction(async (tx) => {
      const prefix = returnType === 'SALES_RETURN' ? 'SR' : 'PR';
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.return.count({
        where: { tenantId, returnType, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
      });
      const returnNumber = `${prefix}-${dateStr}-${String(countToday + 1).padStart(6, '0')}`;

      if (!createReturnDto.items || createReturnDto.items.length === 0) {
        throw new BadRequestException('Return must have at least one item');
      }

      // Check referenced records if provided
      if (returnType === 'SALES_RETURN' && createReturnDto.invoiceId) {
        const inv = await tx.invoice.findFirst({ where: { id: createReturnDto.invoiceId, tenantId } });
        if (!inv) throw new NotFoundException('Referenced invoice not found');
      }
      if (returnType === 'PURCHASE_RETURN' && createReturnDto.purchaseId) {
        const pur = await tx.purchase.findFirst({ where: { id: createReturnDto.purchaseId, tenantId } });
        if (!pur) throw new NotFoundException('Referenced purchase not found');
      }

      const returnRecord = await tx.return.create({
        data: {
          tenantId,
          returnNumber,
          returnType,
          invoiceId: createReturnDto.invoiceId,
          purchaseId: createReturnDto.purchaseId,
          subTotal: createReturnDto.subTotal,
          taxAmount: createReturnDto.taxAmount,
          grandTotal: createReturnDto.grandTotal,
          status: 'COMPLETED',
          userId,
          notes: createReturnDto.notes,
        }
      });

      const returnItemsData = createReturnDto.items.map(item => ({
        tenantId,
        returnId: returnRecord.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPriceOrCost: item.unitPriceOrCost,
        totalAmount: item.totalAmount,
      }));

      await tx.returnItem.createMany({ data: returnItemsData });

      // Update Inventory
      if (returnType === 'SALES_RETURN') {
        await this.inventoryService.recordSalesReturn(tx, tenantId, userId, returnRecord.id, returnItemsData);
      } else {
        await this.inventoryService.recordPurchaseReturn(tx, tenantId, userId, returnRecord.id, returnItemsData);
      }

      return returnRecord;
    });
  }

  async findAll(tenantId: string, page = 1, limit = 50, search?: string, type?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { tenantId, deletedAt: null };
    
    if (search) {
      whereClause.returnNumber = { contains: search, mode: 'insensitive' };
    }
    if (type) {
      whereClause.returnType = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.return.findMany({
        where: whereClause,
        include: { user: { select: { firstName: true, lastName: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.return.count({ where: whereClause })
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const returnRecord = await this.prisma.return.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        returnItems: true,
        user: { select: { firstName: true, lastName: true } },
        invoice: true,
        purchase: true
      }
    });
    
    if (!returnRecord) throw new NotFoundException('Return record not found');
    return returnRecord;
  }
}
