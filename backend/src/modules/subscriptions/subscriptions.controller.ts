import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Current Tenant Subscription' })
  getCurrent(@Request() req: any) {
    return this.subscriptionsService.getCurrentSubscription(req.user.tenantId);
  }

  @Get()
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Subscriptions' })
  getAll() {
    return this.subscriptionsService.getAll();
  }

  @Get(':id')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a Subscription' })
  getOne(@Param('id') id: string) {
    return this.subscriptionsService.getOne(id);
  }

  @Post()
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Subscription' })
  create(@Body() data: any) {
    return this.subscriptionsService.create(data);
  }

  @Patch(':id')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Subscription' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.subscriptionsService.update(id, data);
  }
}
