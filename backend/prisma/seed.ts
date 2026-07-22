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

  // 1. Seed Permissions
  await seedPermissions();

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

async function seedPermissions() {
  const permissions = [
    { module: 'Dashboard', name: 'View Dashboard', code: 'Dashboard.View', description: 'Can view the main dashboard' },
    
    { module: 'Products', name: 'View Products', code: 'Products.View', description: 'Can view products' },
    { module: 'Products', name: 'Create Product', code: 'Products.Create', description: 'Can create new products' },
    { module: 'Products', name: 'Edit Product', code: 'Products.Edit', description: 'Can edit existing products' },
    { module: 'Products', name: 'Delete Product', code: 'Products.Delete', description: 'Can delete products' },
    { module: 'Products', name: 'Export Products', code: 'Products.Export', description: 'Can export product lists' },
    
    { module: 'Categories', name: 'View Categories', code: 'Categories.View', description: 'Can view categories' },
    { module: 'Categories', name: 'Create Category', code: 'Categories.Create', description: 'Can create new categories' },
    { module: 'Categories', name: 'Edit Category', code: 'Categories.Edit', description: 'Can edit existing categories' },
    { module: 'Categories', name: 'Delete Category', code: 'Categories.Delete', description: 'Can delete categories' },
    
    { module: 'Brands', name: 'View Brands', code: 'Brands.View', description: 'Can view brands' },
    { module: 'Brands', name: 'Create Brand', code: 'Brands.Create', description: 'Can create new brands' },
    { module: 'Brands', name: 'Edit Brand', code: 'Brands.Edit', description: 'Can edit existing brands' },
    { module: 'Brands', name: 'Delete Brand', code: 'Brands.Delete', description: 'Can delete brands' },
    
    { module: 'Units', name: 'View Units', code: 'Units.View', description: 'Can view measurement units' },
    { module: 'Units', name: 'Create Unit', code: 'Units.Create', description: 'Can create new units' },
    { module: 'Units', name: 'Edit Unit', code: 'Units.Edit', description: 'Can edit existing units' },
    { module: 'Units', name: 'Delete Unit', code: 'Units.Delete', description: 'Can delete units' },
    
    { module: 'Taxes', name: 'View Taxes', code: 'Taxes.View', description: 'Can view taxes' },
    { module: 'Taxes', name: 'Create Tax', code: 'Taxes.Create', description: 'Can create new taxes' },
    { module: 'Taxes', name: 'Edit Tax', code: 'Taxes.Edit', description: 'Can edit existing taxes' },
    { module: 'Taxes', name: 'Delete Tax', code: 'Taxes.Delete', description: 'Can delete taxes' },
    
    { module: 'Inventory', name: 'View Inventory', code: 'Inventory.View', description: 'Can view inventory stock levels' },
    { module: 'Inventory', name: 'Adjust Inventory', code: 'Inventory.Adjust', description: 'Can make manual stock adjustments' },
    { module: 'Inventory', name: 'Opening Stock', code: 'Inventory.OpeningStock', description: 'Can set opening stock' },
    { module: 'Inventory', name: 'Export Inventory', code: 'Inventory.Export', description: 'Can export inventory data' },
    
    { module: 'Customers', name: 'View Customers', code: 'Customers.View', description: 'Can view customers' },
    { module: 'Customers', name: 'Create Customer', code: 'Customers.Create', description: 'Can create new customers' },
    { module: 'Customers', name: 'Edit Customer', code: 'Customers.Edit', description: 'Can edit existing customers' },
    { module: 'Customers', name: 'Delete Customer', code: 'Customers.Delete', description: 'Can delete customers' },
    
    { module: 'Suppliers', name: 'View Suppliers', code: 'Suppliers.View', description: 'Can view suppliers' },
    { module: 'Suppliers', name: 'Create Supplier', code: 'Suppliers.Create', description: 'Can create new suppliers' },
    { module: 'Suppliers', name: 'Edit Supplier', code: 'Suppliers.Edit', description: 'Can edit existing suppliers' },
    { module: 'Suppliers', name: 'Delete Supplier', code: 'Suppliers.Delete', description: 'Can delete suppliers' },
    
    { module: 'Employees', name: 'View Employees', code: 'Employees.View', description: 'Can view employees' },
    { module: 'Employees', name: 'Create Employee', code: 'Employees.Create', description: 'Can create new employees' },
    { module: 'Employees', name: 'Edit Employee', code: 'Employees.Edit', description: 'Can edit existing employees' },
    { module: 'Employees', name: 'Delete Employee', code: 'Employees.Delete', description: 'Can delete employees' },
    
    { module: 'Roles', name: 'View Roles', code: 'Roles.View', description: 'Can view user roles' },
    { module: 'Roles', name: 'Create Role', code: 'Roles.Create', description: 'Can create new roles' },
    { module: 'Roles', name: 'Edit Role', code: 'Roles.Edit', description: 'Can edit existing roles' },
    { module: 'Roles', name: 'Delete Role', code: 'Roles.Delete', description: 'Can delete roles' },
    { module: 'Roles', name: 'Assign Permissions', code: 'Roles.AssignPermissions', description: 'Can assign permissions to roles' },
    
    { module: 'Billing', name: 'View Billing', code: 'Billing.View', description: 'Can view POS / Billing screen' },
    { module: 'Billing', name: 'Create Invoice', code: 'Billing.CreateInvoice', description: 'Can create new invoices' },
    { module: 'Billing', name: 'Cancel Invoice', code: 'Billing.CancelInvoice', description: 'Can cancel/void invoices' },
    { module: 'Billing', name: 'Print Invoice', code: 'Billing.PrintInvoice', description: 'Can print invoices' },
    
    { module: 'Purchases', name: 'View Purchases', code: 'Purchases.View', description: 'Can view purchase orders' },
    { module: 'Purchases', name: 'Create Purchase', code: 'Purchases.Create', description: 'Can create new purchase orders' },
    { module: 'Purchases', name: 'Return Purchase', code: 'Purchases.Return', description: 'Can process purchase returns' },
    
    { module: 'Returns', name: 'View Returns', code: 'Returns.View', description: 'Can view sales returns' },
    { module: 'Returns', name: 'Approve Return', code: 'Returns.Approve', description: 'Can approve returns' },
    
    { module: 'Reports', name: 'View Reports', code: 'Reports.View', description: 'Can view analytical reports' },
    { module: 'Reports', name: 'Export Reports', code: 'Reports.Export', description: 'Can export reports' },
    
    { module: 'Offers', name: 'View Offers', code: 'Offers.View', description: 'Can view offers' },
    { module: 'Offers', name: 'Create Offer', code: 'Offers.Create', description: 'Can create new offers' },
    { module: 'Offers', name: 'Edit Offer', code: 'Offers.Edit', description: 'Can edit existing offers' },
    { module: 'Offers', name: 'Delete Offer', code: 'Offers.Delete', description: 'Can delete offers' },
    
    { module: 'Coupons', name: 'View Coupons', code: 'Coupons.View', description: 'Can view coupons' },
    { module: 'Coupons', name: 'Create Coupon', code: 'Coupons.Create', description: 'Can create new coupons' },
    { module: 'Coupons', name: 'Edit Coupon', code: 'Coupons.Edit', description: 'Can edit existing coupons' },
    { module: 'Coupons', name: 'Delete Coupon', code: 'Coupons.Delete', description: 'Can delete coupons' },
    
    { module: 'Loyalty', name: 'View Loyalty', code: 'Loyalty.View', description: 'Can view loyalty settings' },
    { module: 'Loyalty', name: 'Manage Loyalty', code: 'Loyalty.Manage', description: 'Can manage loyalty points and rewards' },
    
    { module: 'Settings', name: 'View Settings', code: 'Settings.View', description: 'Can view tenant settings' },
    { module: 'Settings', name: 'Edit Settings', code: 'Settings.Edit', description: 'Can edit tenant settings' },
    
    { module: 'Branches', name: 'View Branches', code: 'Branches.View', description: 'Can view branch lists' },
    { module: 'Branches', name: 'Manage Branches', code: 'Branches.Manage', description: 'Can create/edit/delete branches' },
    
    { module: 'Subscriptions', name: 'View Subscriptions', code: 'Subscriptions.View', description: 'Can view tenant subscription details' },
  ];

  let createdCount = 0;
  for (const perm of permissions) {
    const existing = await prisma.permission.findUnique({
      where: { code: perm.code }
    });
    if (!existing) {
      await prisma.permission.create({ data: perm });
      createdCount++;
    }
  }

  console.log(`Seeded ${createdCount} new permissions.`);
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
