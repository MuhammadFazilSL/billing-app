import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(PlatformJwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Subscriptions' })
  getAll() {
    return this.subscriptionsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Subscription' })
  getOne(@Param('id') id: string) {
    return this.subscriptionsService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a Subscription' })
  create(@Body() data: any) {
    return this.subscriptionsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Subscription' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.subscriptionsService.update(id, data);
  }
}
