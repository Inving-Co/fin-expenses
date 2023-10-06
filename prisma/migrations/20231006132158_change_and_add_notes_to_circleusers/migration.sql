/*
  Warnings:

  - You are about to drop the column `notes` on the `CircleUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CircleUsers" DROP COLUMN "notes",
ADD COLUMN     "activeNote" TEXT,
ADD COLUMN     "activeNoteId" UUID;
