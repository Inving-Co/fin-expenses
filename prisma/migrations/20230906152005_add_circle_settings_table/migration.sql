-- AlterTable
ALTER TABLE "Circles" ADD COLUMN     "circleSettingId" UUID;

-- CreateTable
CREATE TABLE "CircleSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "circleId" UUID,
    "defaultAssetId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleSettings" ADD CONSTRAINT "CircleSettings_defaultAssetId_fkey" FOREIGN KEY ("defaultAssetId") REFERENCES "Assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleSettings" ADD CONSTRAINT "CircleSettings_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
