-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'IDR';

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
