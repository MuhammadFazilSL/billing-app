import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('module') module?: string,
    @Query('type') type?: string,
    @Query('isRead') isRead?: string,
  ) {
    const isReadBool = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationsService.findAll(
      req.user.tenantId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      module,
      type,
      isReadBool
    );
  }

  @Get('unread/count')
  getUnreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user.tenantId);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.tenantId);
  }

  @Patch(':id/read')
  markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.tenantId, id);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.delete(req.user.tenantId, id);
  }
}
