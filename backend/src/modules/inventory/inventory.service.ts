import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpeningStockDto } from './dto/opening-stock.dto';
import { AdjustmentDto } from './dto/adjustment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async addOpeningStock(tenantId: string, userId: string, dto: OpeningStockDto) {
    return this.prisma.$transaction(async (tx) => {
      // Ensure product exists
      const product = await tx.product.findFirst({
        where: { id: dto.productId, tenantId, deletedAt: null },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if opening stock already exists
      const existingOpening = await tx.inventoryTransaction.findFirst({
        where: { tenantId, productId: dto.productId, type: 'OPENING_STOCK' },
      });

      if (existingOpening) {
        throw new BadRequestException('Opening stock already recorded for this product.');
      }

      const balanceAfterTransaction = Number(product.stock) + dto.quantity;

      // Create transaction
      const transaction = await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: dto.productId,
          type: 'OPENING_STOCK',
          direction: 'IN',
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          balanceAfterTransaction,
          userId,
          remarks: dto.remarks || 'Initial Opening Stock',
        },
      });

      // Update product stock
      await tx.product.update({
        where: { id: dto.productId },
        data: { stock: balanceAfterTransaction },
      });

      return transaction;
    });
  }

  async addAdjustment(tenantId: string, userId: string, dto: AdjustmentDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: dto.productId, tenantId, deletedAt: null },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const currentStock = Number(product.stock);
      let balanceAfterTransaction = currentStock;

      if (dto.direction === 'IN') {
        balanceAfterTransaction += dto.quantity;
      } else {
        if (currentStock < dto.quantity) {
          throw new BadRequestException('Insufficient stock for outward adjustment.');
        }
        balanceAfterTransaction -= dto.quantity;
      }

      const transaction = await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: dto.productId,
          type: dto.reason, // e.g. DAMAGED, EXPIRED, FOUND
          direction: dto.direction,
          quantity: dto.quantity,
          unitCost: product.purchasePrice,
          balanceAfterTransaction,
          userId,
          remarks: dto.remarks,
        },
      });

      await tx.product.update({
        where: { id: dto.productId },
        data: { stock: balanceAfterTransaction },
      });

      return transaction;
    });

    if (result) {
      await this.checkLowStock(tenantId, dto.productId);
    }
    
    return result;
  }

  async recordSale(tx: any, tenantId: string, userId: string, invoiceId: string, items: any[]) {
    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, tenantId, deletedAt: null },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productName} not found`);
      }

      const currentStock = Number(product.stock);
      
      // Usually POS allows negative stock to not block checkout, but let's assume we just decrement it.
      const balanceAfterTransaction = currentStock - item.quantity;
      
      // Async emit low stock check outside tx wait
      this.checkLowStock(tenantId, item.productId, balanceAfterTransaction);

      await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: item.productId,
          type: 'SALE',
          direction: 'OUT',
          quantity: item.quantity,
          unitCost: product.purchasePrice,
          balanceAfterTransaction,
          referenceType: 'INVOICE',
          referenceId: invoiceId,
          userId,
          remarks: 'POS Sale',
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: balanceAfterTransaction },
      });
    }
  }

  async recordPurchase(tx: any, tenantId: string, userId: string, purchaseId: string, items: any[]) {
    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, tenantId, deletedAt: null },
      });

      if (!product) throw new NotFoundException(`Product ${item.productName} not found`);

      const currentStock = Number(product.stock);
      const balanceAfterTransaction = currentStock + Number(item.quantity);

      await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: item.productId,
          type: 'PURCHASE',
          direction: 'IN',
          quantity: item.quantity,
          unitCost: item.unitCost, // Update to new purchase cost if necessary
          balanceAfterTransaction,
          referenceType: 'PURCHASE',
          referenceId: purchaseId,
          userId,
          remarks: 'Purchase Restock',
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: balanceAfterTransaction, purchasePrice: item.unitCost }, // Optionally update purchase price
      });
    }
  }

  async recordSalesReturn(tx: any, tenantId: string, userId: string, returnId: string, items: any[]) {
    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, tenantId, deletedAt: null },
      });

      if (!product) throw new NotFoundException(`Product ${item.productName} not found`);

      const currentStock = Number(product.stock);
      const balanceAfterTransaction = currentStock + Number(item.quantity); // Sale Return increases stock

      await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: item.productId,
          type: 'SALE_RETURN',
          direction: 'IN',
          quantity: item.quantity,
          unitCost: product.purchasePrice,
          balanceAfterTransaction,
          referenceType: 'RETURN',
          referenceId: returnId,
          userId,
          remarks: 'Sales Return',
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: balanceAfterTransaction },
      });
    }
  }

  async recordPurchaseReturn(tx: any, tenantId: string, userId: string, returnId: string, items: any[]) {
    for (const item of items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, tenantId, deletedAt: null },
      });

      if (!product) throw new NotFoundException(`Product ${item.productName} not found`);

      const currentStock = Number(product.stock);
      const balanceAfterTransaction = currentStock - Number(item.quantity); // Purchase Return decreases stock

      await tx.inventoryTransaction.create({
        data: {
          tenantId,
          productId: item.productId,
          type: 'PURCHASE_RETURN',
          direction: 'OUT',
          quantity: item.quantity,
          unitCost: product.purchasePrice,
          balanceAfterTransaction,
          referenceType: 'RETURN',
          referenceId: returnId,
          userId,
          remarks: 'Purchase Return',
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: balanceAfterTransaction },
      });
    }
  }

  async getLedger(tenantId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({
        where: { tenantId },
        include: { product: true, user: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryTransaction.count({ where: { tenantId } })
    ]);

    return { data: transactions, total, page, limit };
  }

  async getProductHistory(productId: string, tenantId: string) {
    return this.prisma.inventoryTransaction.findMany({
      where: { tenantId, productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLowStock(tenantId: string) {
    // We cannot do "WHERE stock <= minimumStock" directly in Prisma safely without raw query if minimumStock is decimal field,
    // actually Prisma supports field comparisons since v4.3.
    // Let's use Prisma field comparison:
    return this.prisma.product.findMany({
      where: {
        tenantId,
        deletedAt: null,
        stock: { lte: this.prisma.product.fields.minimumStock },
      },
      include: { category: true, brand: true },
    });
  }

  async getSummary(tenantId: string) {
    const products = await this.prisma.product.findMany({
      where: { tenantId, deletedAt: null },
      select: { stock: true, purchasePrice: true },
    });

    let totalValue = 0;
    let totalItems = 0;
    
    products.forEach(p => {
      totalItems += Number(p.stock);
      totalValue += Number(p.stock) * Number(p.purchasePrice);
    });

    return {
      totalItems,
      totalValue,
      totalSKUs: products.length,
    };
  }

  private async checkLowStock(tenantId: string, productId: string, knownStock?: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) return;

    const currentStock = knownStock !== undefined ? knownStock : Number(product.stock);
    const minStock = Number(product.minimumStock || 0);

    if (currentStock <= 0) {
      await this.notificationsService.emitNotification({
        tenantId,
        module: 'Inventory',
        type: 'ERROR',
        title: 'Out of Stock',
        message: `Product ${product.name} is out of stock.`,
        referenceId: product.id,
        referenceType: 'Product',
      });
    } else if (currentStock <= minStock) {
      await this.notificationsService.emitNotification({
        tenantId,
        module: 'Inventory',
        type: 'WARNING',
        title: 'Low Stock Alert',
        message: `Product ${product.name} is running low on stock (${currentStock} remaining).`,
        referenceId: product.id,
        referenceType: 'Product',
      });
    }
  }
}
