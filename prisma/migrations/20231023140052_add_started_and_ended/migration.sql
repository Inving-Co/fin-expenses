/*
  Warnings:

  - Added the required column `endedAt` to the `CircleBudgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `CircleBudgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CircleBudgets" ADD COLUMN     "endedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
