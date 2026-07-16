import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Taxes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createTaxDto: CreateTaxDto) {
    return this.taxesService.create(user.tenantId, createTaxDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.taxesService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxesService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateTaxDto: UpdateTaxDto) {
    return this.taxesService.update(id, user.tenantId, updateTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.taxesService.remove(id, user.tenantId);
  }
}
