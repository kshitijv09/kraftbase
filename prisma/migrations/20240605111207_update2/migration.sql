-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "rating" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "age" DROP NOT NULL;
