-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "circleId" UUID,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
