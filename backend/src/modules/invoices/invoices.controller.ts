import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice (POS Sale)' })
  create(@CurrentUser() user: any, @Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(user.tenantId, user.id, createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
  ) {
    return this.invoicesService.findAll(user.tenantId, parseInt(page, 10), parseInt(limit, 10), search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.invoicesService.findOne(id, user.tenantId);
  }
}
