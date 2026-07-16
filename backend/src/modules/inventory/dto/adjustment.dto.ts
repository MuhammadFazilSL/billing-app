import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsUUID, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiProperty()
  @IsString()
  @IsIn(['IN', 'OUT'])
  direction!: string;

  @ApiProperty()
  @IsString()
  @IsIn(['DAMAGED', 'EXPIRED', 'MANUAL_CORRECTION', 'LOST', 'FOUND', 'OTHER'])
  reason!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;
}
