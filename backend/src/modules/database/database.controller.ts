import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('Diagnostics')
@Controller('database')
export class DatabaseController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  @ApiOperation({ summary: 'Database Diagnostic Verification' })
  @ApiResponse({
    status: 200,
    description: 'Database is connected and migrated successfully',
  })
  async check() {
    try {
      // 1. Verify connection state
      await this.prisma.$queryRaw`SELECT 1`;

      // 2. Query last applied migration name from postgres internal schema table
      const migrations = await this.prisma.$queryRawUnsafe<any[]>(
        'SELECT migration_name FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 1',
      );
      const lastMigration = migrations?.[0]?.migration_name || 'No migrations found';

      return {
        success: true,
        status: 'Database Connected',
        prismaVersion: Prisma.prismaVersion.client,
        lastAppliedMigration: lastMigration,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        status: 'Database Connection Failed',
        error: error instanceof Error ? error.message : 'Unknown database validation error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
