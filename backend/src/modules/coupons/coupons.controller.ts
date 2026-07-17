import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  create(@CurrentUser() user: any, @Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(user.tenantId, createCouponDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active coupons' })
  findAll(@CurrentUser() user: any) {
    return this.couponsService.findAll(user.tenantId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code' })
  async validateCoupon(@CurrentUser() user: any, @Body() body: { code: string, purchaseAmount: number }) {
    if (!body.code) throw new BadRequestException('Coupon code is required');
    return this.couponsService.validateCoupon(user.tenantId, body.code, body.purchaseAmount);
  }
}
