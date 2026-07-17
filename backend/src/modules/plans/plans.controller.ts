import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Plans' })
  getAll() {
    return this.plansService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Plan' })
  getOne(@Param('id') id: string) {
    return this.plansService.getOne(id);
  }

  @Post()
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Plan (Platform Admin only)' })
  create(@Body() data: any) {
    return this.plansService.create(data);
  }

  @Patch(':id')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Plan (Platform Admin only)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.plansService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Plan (Platform Admin only)' })
  delete(@Param('id') id: string) {
    return this.plansService.delete(id);
  }
}
