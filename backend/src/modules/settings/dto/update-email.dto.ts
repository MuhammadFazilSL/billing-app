import { IsString, IsOptional, IsNumber, MaxLength, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmailDto {
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(255) smtpHost?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() smtpPort?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(255) smtpUsername?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(255) smtpPassword?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(100) senderName?: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() @MaxLength(100) senderEmail?: string;
}
