import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getCustomerLoyalty(tenantId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId, deletedAt: null }
    });
    
    if (!customer) throw new NotFoundException('Customer not found');

    const history = await this.prisma.loyaltyTransaction.findMany({
      where: { tenantId, customerId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return {
      balance: customer.loyaltyPoints,
      history
    };
  }

  async earnPoints(tx: any, tenantId: string, customerId: string, invoiceId: string, purchaseAmount: number) {
    // 1 point per $100 spent (Floor division)
    const pointsToEarn = Math.floor(purchaseAmount / 100);
    
    if (pointsToEarn > 0) {
      await tx.loyaltyTransaction.create({
        data: {
          tenantId,
          customerId,
          invoiceId,
          type: 'EARN',
          points: pointsToEarn,
          remarks: `Earned from invoice`
        }
      });

      await tx.customer.update({
        where: { id: customerId },
        data: { loyaltyPoints: { increment: pointsToEarn } }
      });
    }

    return pointsToEarn;
  }

  async redeemPoints(tenantId: string, customerId: string, points: number, invoiceId?: string, remarks?: string, externalTx?: any) {
    const runTransaction = async (tx: any) => {
      const customer = await tx.customer.findFirst({
        where: { id: customerId, tenantId, deletedAt: null }
      });

      if (!customer) throw new NotFoundException('Customer not found');
      if (customer.loyaltyPoints < points) {
        throw new BadRequestException(`Insufficient loyalty points. Available: ${customer.loyaltyPoints}`);
      }

      await tx.loyaltyTransaction.create({
        data: {
          tenantId,
          customerId,
          invoiceId,
          type: 'REDEEM',
          points: points,
          remarks: remarks || `Redeemed points`
        }
      });

      await tx.customer.update({
        where: { id: customerId },
        data: { loyaltyPoints: { decrement: points } }
      });

      return { success: true, redeemedPoints: points, discountValue: points }; // 1 point = $1
    };

    if (externalTx) {
      return runTransaction(externalTx);
    } else {
      return this.prisma.$transaction(runTransaction);
    }
  }
}
