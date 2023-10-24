-- CreateTable
CREATE TABLE "CircleBudgets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "circleId" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleBudgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleBudgetPlannings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID,
    "circleBudgetId" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "categoryId" UUID,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleBudgetPlannings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleNotes" ADD CONSTRAINT "CircleNotes_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleNotes" ADD CONSTRAINT "CircleNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleBudgets" ADD CONSTRAINT "CircleBudgets_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleBudgets" ADD CONSTRAINT "CircleBudgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleBudgetPlannings" ADD CONSTRAINT "CircleBudgetPlannings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleBudgetPlannings" ADD CONSTRAINT "CircleBudgetPlannings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
