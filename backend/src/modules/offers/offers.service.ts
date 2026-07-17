import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createOfferDto: CreateOfferDto) {
    return this.prisma.offer.create({
      data: {
        tenantId,
        ...createOfferDto,
        applicableProductIds: createOfferDto.applicableProductIds || [],
        applicableCategoryIds: createOfferDto.applicableCategoryIds || [],
      }
    });
  }

  async findAll(tenantId: string) {
    const now = new Date();
    return this.prisma.offer.findMany({
      where: { 
        tenantId, 
        deletedAt: null,
        isActive: true,
        OR: [
          { validFrom: null, validTo: null },
          { validFrom: { lte: now }, validTo: null },
          { validFrom: null, validTo: { gte: now } },
          { validFrom: { lte: now }, validTo: { gte: now } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
