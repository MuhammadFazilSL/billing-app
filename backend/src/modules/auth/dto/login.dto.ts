import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@acme.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'strongpassword123', description: 'User password' })
  @IsString()
  @MinLength(8)
  password!: string;
}
