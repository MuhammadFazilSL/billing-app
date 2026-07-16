import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  create(@CurrentUser() user: any, @Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create(user.tenantId, user.id, createPurchaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchases' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
  ) {
    return this.purchasesService.findAll(user.tenantId, parseInt(page, 10), parseInt(limit, 10), search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.purchasesService.findOne(id, user.tenantId);
  }
}
