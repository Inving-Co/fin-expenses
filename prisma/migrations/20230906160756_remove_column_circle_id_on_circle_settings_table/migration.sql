/*
  Warnings:

  - You are about to drop the column `circleId` on the `CircleSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CircleSettings" DROP CONSTRAINT "CircleSettings_circleId_fkey";

-- AlterTable
ALTER TABLE "CircleSettings" DROP COLUMN "circleId";
