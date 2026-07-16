/*
  Warnings:

  - You are about to drop the column `notes` on the `inventory_transactions` table. All the data in the column will be lost.
  - Added the required column `balance_after_transaction` to the `inventory_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_transactions" DROP COLUMN "notes",
ADD COLUMN     "balance_after_transaction" DECIMAL(12,3) NOT NULL,
ADD COLUMN     "reference_type" VARCHAR(50),
ADD COLUMN     "remarks" TEXT;
