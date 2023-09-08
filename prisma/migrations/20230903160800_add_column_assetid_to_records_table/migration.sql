-- AlterTable
ALTER TABLE "Records" ADD COLUMN     "assetId" UUID;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
