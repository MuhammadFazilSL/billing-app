import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReturnItemDto {
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
  unitPriceOrCost!: number;

  @ApiProperty()
  @IsNumber()
  totalAmount!: number;
}

export class CreateReturnDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseId?: string;

  @ApiProperty()
  @IsNumber()
  subTotal!: number;

  @ApiProperty()
  @IsNumber()
  taxAmount!: number;

  @ApiProperty()
  @IsNumber()
  grandTotal!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [ReturnItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items!: ReturnItemDto[];
}
