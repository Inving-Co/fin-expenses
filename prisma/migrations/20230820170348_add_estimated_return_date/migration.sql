/*
  Warnings:

  - You are about to drop the column `estimatedReturn` on the `AssetHistory` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedReturn` on the `Assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssetHistory" DROP COLUMN "estimatedReturn",
ADD COLUMN     "estimatedReturnAmount" INTEGER,
ADD COLUMN     "estimatedReturnDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Assets" DROP COLUMN "estimatedReturn",
ADD COLUMN     "estimatedReturnAmount" INTEGER,
ADD COLUMN     "estimatedReturnDate" TIMESTAMP(3);
