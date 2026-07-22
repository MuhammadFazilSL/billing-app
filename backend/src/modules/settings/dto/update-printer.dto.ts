import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePrinterDto {
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) printerType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) paperSize?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() copies?: number;
}
