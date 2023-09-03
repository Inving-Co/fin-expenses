-- AlterTable
ALTER TABLE "Records" RENAME CONSTRAINT "Transactions_pkey" TO "Records_pkey";

-- RenameForeignKey
ALTER TABLE "Records" RENAME CONSTRAINT "Transactions_categoryId_fkey" TO "Records_categoryId_fkey";

-- RenameForeignKey
ALTER TABLE "Records" RENAME CONSTRAINT "Transactions_circleId_fkey" TO "Records_circleId_fkey";

-- RenameForeignKey
ALTER TABLE "Records" RENAME CONSTRAINT "Transactions_userId_fkey" TO "Records_userId_fkey";
