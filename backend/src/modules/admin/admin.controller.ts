import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from './guards/platform-jwt-auth.guard';
import { LoginDto } from '../auth/dto/login.dto';

@ApiTags('Platform Admin')
@Controller('platform')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Platform Admin Login' })
  login(@Body() loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Platform Admin Profile' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
