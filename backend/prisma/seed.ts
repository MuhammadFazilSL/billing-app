import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create Platform Admin
  const adminName = process.env.PLATFORM_ADMIN_NAME || 'Super Admin';
  const adminEmail = process.env.PLATFORM_ADMIN_EMAIL || 'admin@saas.com';
  const adminPassword = process.env.PLATFORM_ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await prisma.platformAdmin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.platformAdmin.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`Created PlatformAdmin: ${adminEmail}`);
  } else {
    console.log(`PlatformAdmin already exists: ${adminEmail}`);
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
