-- AddForeignKey
ALTER TABLE "BulkRecords" ADD CONSTRAINT "BulkRecords_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkRecords" ADD CONSTRAINT "BulkRecords_assetHistoryId_fkey" FOREIGN KEY ("assetHistoryId") REFERENCES "AssetHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
