import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService,
    private usageService: UsageService
  ) {}

  async create(tenantId: string, createEmployeeDto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createEmployeeDto.email },
    });
    
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(createEmployeeDto.password, 10);
    const { password, ...rest } = createEmployeeDto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
        tenantId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        employeeCode: true,
        designation: true,
        joiningDate: true,
        salary: true,
        status: true,
        createdAt: true,
      }
    });
    
    await this.usageService.incrementEmployees(tenantId);
    return user;
  }

  async findAll(tenantId: string, page = 1, limit = 50, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { tenantId, deletedAt: null };
    
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          employeeCode: true,
          designation: true,
          joiningDate: true,
          salary: true,
          status: true,
          createdAt: true,
        }
      }),
      this.prisma.user.count({ where: whereClause })
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const employee = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        employeeCode: true,
        designation: true,
        joiningDate: true,
        salary: true,
        notes: true,
        status: true,
        createdAt: true,
      }
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, tenantId: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id, tenantId);
    let updateData: any = { ...updateEmployeeDto };

    if (updateEmployeeDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateEmployeeDto.password, 10);
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id: employee.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      }
    });
  }

  async remove(id: string, tenantId: string) {
    const employee = await this.findOne(id, tenantId);
    const deleted = await this.prisma.user.update({
      where: { id: employee.id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
    await this.usageService.decrementEmployees(tenantId);
    return deleted;
  }
}
