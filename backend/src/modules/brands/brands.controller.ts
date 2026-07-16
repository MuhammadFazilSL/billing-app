import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Brands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(user.tenantId, createBrandDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.brandsService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brandsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, user.tenantId, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brandsService.remove(id, user.tenantId);
  }
}
