import {getRecordsForExport} from "../../models/records";

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined
   
    const records = await getRecordsForExport(circle?.id)

    const csvContent = records.map(record => Object.values(record).join(",")).join("\n");
    const filename = `records_${new Date().toISOString().split('T')[0]}.csv`;
    
    event.node.res.setHeader('Content-Type', 'text/csv');
    event.node.res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    event.node.res.end(csvContent);

})
