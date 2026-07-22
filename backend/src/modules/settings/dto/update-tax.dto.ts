import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaxDto {
  @ApiPropertyOptional() @IsUUID() @IsOptional() defaultTaxId?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() taxInclusive?: boolean;
}
