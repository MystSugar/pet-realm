/*
  Warnings:

  - You are about to drop the column `deliveryAreas` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryFee` on the `shops` table. All the data in the column will be lost.
  - The `businessHours` column on the `shops` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "deliveryAreas",
DROP COLUMN "deliveryFee",
ADD COLUMN     "deliveryZones" JSONB,
DROP COLUMN "businessHours",
ADD COLUMN     "businessHours" JSONB;
