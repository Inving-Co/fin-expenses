-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
