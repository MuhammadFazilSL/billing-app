import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary metrics' })
  getDashboard(@CurrentUser() user: any) {
    return this.reportsService.getDashboard(user.tenantId);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales report' })
  getSales(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getSales(user.tenantId, filter);
  }

  @Get('purchases')
  @ApiOperation({ summary: 'Get purchases report' })
  getPurchases(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getPurchases(user.tenantId, filter);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  getInventory(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getInventory(user.tenantId, filter);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customers report' })
  getCustomers(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getCustomers(user.tenantId, filter);
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get suppliers report' })
  getSuppliers(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getSuppliers(user.tenantId, filter);
  }

  @Get('taxes')
  @ApiOperation({ summary: 'Get tax report' })
  getTaxes(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getTaxes(user.tenantId, filter);
  }

  @Get('profit-loss')
  @ApiOperation({ summary: 'Get profit & loss report' })
  getProfitLoss(@CurrentUser() user: any, @Query() filter: ReportFilterDto) {
    return this.reportsService.getProfitLoss(user.tenantId, filter);
  }
}
