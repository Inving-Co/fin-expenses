-- AddForeignKey
ALTER TABLE "Circles" ADD CONSTRAINT "Circles_circleSettingId_fkey" FOREIGN KEY ("circleSettingId") REFERENCES "CircleSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
