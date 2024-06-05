/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `delivery_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_agent_id_fkey";

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "availability" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ADD COLUMN     "delivery_address" TEXT NOT NULL,
ADD COLUMN     "menu_id" INTEGER NOT NULL,
ADD COLUMN     "order_serial_no" SERIAL NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "order_id" DROP DEFAULT,
ALTER COLUMN "order_id" SET DATA TYPE TEXT,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "accept_status" DROP NOT NULL,
ALTER COLUMN "delivery_status" DROP NOT NULL,
ALTER COLUMN "agent_id" DROP NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("order_serial_no");
DROP SEQUENCE "Order_order_id_seq";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("agent_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;
