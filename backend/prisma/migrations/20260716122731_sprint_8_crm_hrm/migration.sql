-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "credit_limit" DECIMAL(12,2),
ADD COLUMN     "last_purchase_date" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "designation" VARCHAR(100),
ADD COLUMN     "employee_code" VARCHAR(50),
ADD COLUMN     "joining_date" DATE,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "salary" DECIMAL(10,2);
