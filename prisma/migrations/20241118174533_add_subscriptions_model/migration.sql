-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "nextPaymentDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,
    "circleId" UUID,
    "currency" TEXT NOT NULL DEFAULT 'IDR',

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
