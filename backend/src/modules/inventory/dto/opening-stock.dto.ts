import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OpeningStockDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitCost!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
