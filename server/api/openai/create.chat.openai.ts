import axios from "axios";
import { getRecordsForChat } from "~/server/models/records";

async function fetchRecords(key: string, circleId: string, startDate: string, endDate: string) {
    return getRecordsForChat(key, {
        start: startDate as string,
        end: endDate as string
    }, circleId)
}

export default defineEventHandler(async (event) => {
    const { messages } = await readBody(event);

    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    axios.defaults.timeout = 8000;

    var functions = [
        {
            "name": "get_transaction_records",
            "description": "Get the user transactions records such as expenses and income, to get the total sum amount and category has type for debt or income, default is expenses",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "the key for search the description"},
                    "startDate": {"type": "string", "description": "start date of the records with format yyyy-mm-dd HH:mm"},
                    "endDate": {"type": "string", "description": "end date of the records with format yyyy-mm-dd HH:mm"},
                },
            },
        }
    ]

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            data: {
                "model": "gpt-3.5-turbo-16k",
                "messages": messages,
                "functions": functions,
                "function_call": "auto",
            }
        });

        if (response.status !== 200) {
            throw new Error('Bad request');
        }

        let responseMessage = response.data.choices[0].message;

        if (responseMessage.function_call) {

            const availableFunctions: any = {
                get_transaction_records: fetchRecords,
            }; 
            
            const functionName = responseMessage.function_call.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(responseMessage.function_call.arguments);
            const functionResponse = JSON.stringify(await functionToCall(
                functionArgs.key,
                circle?.id,
                functionArgs.startDate,
                functionArgs.endDate,
            ));
            messages.push(responseMessage);
            messages.push({
                "role": "function",
                "name": functionName,
                "content": functionResponse,
            }); 

            const secondResponse = await axios({
                method: 'post',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                data: {
                    "model": "gpt-3.5-turbo-16k",
                    "messages": messages,
                }
            });
    
            return secondResponse.data
        }
        
        return response.data;
    } catch (e) {

        throw createError({
            status: 400,
            message: e?.message ?? "Something went wrong",
        });
    }
});
