import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvoiceDto {
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) invoicePrefix?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) invoiceSuffix?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() nextInvoiceNumber?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() receiptFooter?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() showLogo?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() showTax?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() showBarcode?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(20) thermalReceiptWidth?: string;
}
