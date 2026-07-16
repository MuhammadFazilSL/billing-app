import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class InvoiceItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName!: string;

  @ApiProperty()
  @IsNumber()
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  unitPrice!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty()
  @IsNumber()
  totalAmount!: number;
}

export class CreateInvoiceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty()
  @IsNumber()
  subTotal!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty()
  @IsNumber()
  taxAmount!: number;

  @ApiProperty()
  @IsNumber()
  grandTotal!: number;

  @ApiProperty()
  @IsNumber()
  amountPaid!: number;

  @ApiProperty()
  @IsString()
  paymentStatus!: string; // PENDING, PAID, FAILED, REFUNDED

  @ApiProperty()
  @IsString()
  paymentMethod!: string; // CASH, UPI, CARD

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items!: InvoiceItemDto[];
}
