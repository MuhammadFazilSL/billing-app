import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAllGroupedByModule() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [
        { module: 'asc' },
        { code: 'asc' }
      ]
    });

    // Group by module
    const grouped = permissions.reduce((acc, curr) => {
      if (!acc[curr.module]) {
        acc[curr.module] = [];
      }
      acc[curr.module].push(curr);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(grouped).map(module => ({
      module,
      permissions: grouped[module]
    }));
  }
}
