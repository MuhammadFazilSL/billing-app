import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { OpeningStockDto } from './dto/opening-stock.dto';
import { AdjustmentDto } from './dto/adjustment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('opening-stock')
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Add opening stock (Owner/Manager only)' })
  addOpeningStock(@CurrentUser() user: any, @Body() dto: OpeningStockDto) {
    return this.inventoryService.addOpeningStock(user.tenantId, user.id, dto);
  }

  @Post('adjustment')
  @ApiOperation({ summary: 'Add inventory adjustment' })
  addAdjustment(@CurrentUser() user: any, @Body() dto: AdjustmentDto) {
    return this.inventoryService.addAdjustment(user.tenantId, user.id, dto);
  }

  @Get('ledger')
  @ApiOperation({ summary: 'Get overall inventory transaction ledger' })
  getLedger(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    return this.inventoryService.getLedger(user.tenantId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Get('product/:id/history')
  @ApiOperation({ summary: 'Get transaction history for a specific product' })
  getProductHistory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.getProductHistory(id, user.tenantId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get list of products low on stock' })
  getLowStock(@CurrentUser() user: any) {
    return this.inventoryService.getLowStock(user.tenantId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get inventory value and item summary' })
  getSummary(@CurrentUser() user: any) {
    return this.inventoryService.getSummary(user.tenantId);
  }
}
