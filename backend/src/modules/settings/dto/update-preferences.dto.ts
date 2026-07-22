import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() darkMode?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() compactSidebar?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) dashboardLayout?: string;
}

export class UpdateBackupDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() autoBackup?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() @MaxLength(50) backupFrequency?: string;
}
