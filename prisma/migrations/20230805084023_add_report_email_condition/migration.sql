-- AlterTable
ALTER TABLE "CircleUsers" ADD COLUMN     "latestReportReceivedAt" TIMESTAMP(3),
ADD COLUMN     "receiveReport" BOOLEAN NOT NULL DEFAULT true;
