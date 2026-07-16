import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validateEnv } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { UnitsModule } from './modules/units/units.module';
import { TaxesModule } from './modules/taxes/taxes.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    TenantModule,
    DashboardModule,
    CategoriesModule,
    BrandsModule,
    UnitsModule,
    TaxesModule,
    ProductsModule,
    InventoryModule,
    CustomersModule,
    SuppliersModule,
    EmployeesModule,
    RolesModule,
    InvoicesModule,
    PurchasesModule,
    ReturnsModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
