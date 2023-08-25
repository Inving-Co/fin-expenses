/*
  Warnings:

  - Made the column `assetId` on table `AssetHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_assetId_fkey";

-- AlterTable
ALTER TABLE "AssetHistory" ALTER COLUMN "assetId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
