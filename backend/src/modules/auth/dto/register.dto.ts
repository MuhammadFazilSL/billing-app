import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Acme Corp', description: 'Name of the company/tenant' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ example: 'John', description: 'First name of the owner' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the owner' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'john@acme.com', description: 'Email of the owner' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password for the owner' })
  @IsString()
  @MinLength(8)
  password!: string;
  
  @ApiPropertyOptional({ example: '123-456-7890', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
  
  @ApiPropertyOptional({ description: 'ID of the subscription plan. If not provided, a default plan will be used if available.' })
  @IsString()
  @IsOptional()
  planId?: string;
}
