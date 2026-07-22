import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async emitNotification(dto: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          tenantId: dto.tenantId,
          module: dto.module,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          referenceId: dto.referenceId,
          referenceType: dto.referenceType,
          actionUrl: dto.actionUrl,
          isRead: false,
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to emit notification: ${error.message}`, error.stack);
    }
  }

  async findAll(tenantId: string, page = 1, limit = 20, module?: string, type?: string, isRead?: boolean) {
    const skip = (page - 1) * limit;
    
    const where: any = { tenantId };
    if (module) where.module = module;
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(tenantId: string) {
    const count = await this.prisma.notification.count({
      where: { tenantId, isRead: false },
    });
    return { count };
  }

  async markAsRead(tenantId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, tenantId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(tenantId: string) {
    return this.prisma.notification.updateMany({
      where: { tenantId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.notification.deleteMany({
      where: { id, tenantId },
    });
  }
}
