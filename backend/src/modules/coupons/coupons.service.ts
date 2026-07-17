import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        tenantId,
        ...createCouponDto,
      }
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.coupon.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }

  async validateCoupon(tenantId: string, code: string, purchaseAmount: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { tenantId, code, deletedAt: null }
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      throw new BadRequestException('Coupon is not yet valid');
    }
    if (coupon.validTo && new Date(coupon.validTo) < now) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.minPurchaseAmount && purchaseAmount < Number(coupon.minPurchaseAmount)) {
      throw new BadRequestException(`Minimum purchase amount of $${coupon.minPurchaseAmount} required`);
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (purchaseAmount * Number(coupon.value)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.value);
    }

    // Prevent discounting more than the purchase amount itself
    if (discountAmount > purchaseAmount) {
      discountAmount = purchaseAmount;
    }

    return {
      isValid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      type: coupon.type,
      value: Number(coupon.value)
    };
  }
}
