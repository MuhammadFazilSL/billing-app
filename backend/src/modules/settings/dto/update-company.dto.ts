import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) companyName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) legalName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(255) logo?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) gstNumber?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) panNumber?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) phone?: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() @MaxLength(100) email?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(150) website?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() address?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) city?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) state?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) country?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) postalCode?: string;
}
