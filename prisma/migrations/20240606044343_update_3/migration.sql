/*
  Warnings:

  - You are about to alter the column `price` on the `Menu` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "deliveryCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "rating" SET DEFAULT 4,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "accept_status" SET DEFAULT 'pending';
