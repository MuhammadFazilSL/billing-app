import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offer' })
  create(@CurrentUser() user: any, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(user.tenantId, createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active offers' })
  findAll(@CurrentUser() user: any) {
    return this.offersService.findAll(user.tenantId);
  }
}
