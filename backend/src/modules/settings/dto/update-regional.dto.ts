import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRegionalDto {
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) timezone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) language?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(10) currency?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(10) currencySymbol?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) dateFormat?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) numberFormat?: string;
}
