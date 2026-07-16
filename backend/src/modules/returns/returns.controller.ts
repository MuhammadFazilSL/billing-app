import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Returns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post('sales')
  @ApiOperation({ summary: 'Create a new sales return' })
  createSalesReturn(@CurrentUser() user: any, @Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.createReturn(user.tenantId, user.id, 'SALES_RETURN', createReturnDto);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Create a new purchase return' })
  createPurchaseReturn(@CurrentUser() user: any, @Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.createReturn(user.tenantId, user.id, 'PURCHASE_RETURN', createReturnDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all returns' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.returnsService.findAll(user.tenantId, parseInt(page, 10), parseInt(limit, 10), search, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.returnsService.findOne(id, user.tenantId);
  }
}
