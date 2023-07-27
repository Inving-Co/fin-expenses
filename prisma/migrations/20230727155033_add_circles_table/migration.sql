-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "circleId" INTEGER;

-- CreateTable
CREATE TABLE "Circles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Circles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleUsers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "circleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CircleUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Circles" ADD CONSTRAINT "Circles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleUsers" ADD CONSTRAINT "CircleUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleUsers" ADD CONSTRAINT "CircleUsers_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
