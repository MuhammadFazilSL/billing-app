import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;
}
