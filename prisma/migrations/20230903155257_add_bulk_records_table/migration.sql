-- AlterTable
ALTER TABLE "Assets" ADD COLUMN     "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BulkRecords" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetHistoryId" UUID NOT NULL,
    "recordId" UUID NOT NULL,

    CONSTRAINT "BulkRecords_pkey" PRIMARY KEY ("id")
);
