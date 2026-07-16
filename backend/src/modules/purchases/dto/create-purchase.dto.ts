import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PurchaseItemDto {
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
  unitCost!: number;

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

export class CreatePurchaseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  supplierId?: string;

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
  paymentStatus!: string;

  @ApiProperty()
  @IsString()
  paymentMethod!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [PurchaseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];
}
