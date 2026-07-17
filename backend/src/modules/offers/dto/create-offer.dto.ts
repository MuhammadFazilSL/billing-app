import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'PERCENTAGE or FLAT' })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @IsNumber()
  value!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  applicableProductIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  applicableCategoryIds?: string[];

  @ApiProperty({ description: 'PRODUCT, CATEGORY, or STORE' })
  @IsString()
  @IsNotEmpty()
  offerScope!: string;
}
