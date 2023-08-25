/*
  Warnings:

  - Added the required column `actionName` to the `AssetHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssetHistory" ADD COLUMN     "actionName" TEXT NOT NULL;
