import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { RedeemLoyaltyDto } from './dto/redeem-loyalty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Loyalty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get(':customerId')
  @ApiOperation({ summary: 'Get loyalty balance and history for a customer' })
  getCustomerLoyalty(@Param('customerId') customerId: string, @CurrentUser() user: any) {
    return this.loyaltyService.getCustomerLoyalty(user.tenantId, customerId);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Manually redeem loyalty points' })
  redeemPoints(@CurrentUser() user: any, @Body() body: RedeemLoyaltyDto) {
    return this.loyaltyService.redeemPoints(user.tenantId, body.customerId, body.points, body.invoiceId, body.remarks);
  }
}
