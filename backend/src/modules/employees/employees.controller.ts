import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Create a new employee' })
  create(@CurrentUser() user: any, @Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(user.tenantId, createEmployeeDto);
  }

  @Get()
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Get all employees' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('search') search?: string,
  ) {
    return this.employeesService.findAll(user.tenantId, parseInt(page, 10), parseInt(limit, 10), search);
  }

  @Get(':id')
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Get an employee by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.employeesService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Update an employee' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, user.tenantId, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Delete an employee' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.employeesService.remove(id, user.tenantId);
  }
}
