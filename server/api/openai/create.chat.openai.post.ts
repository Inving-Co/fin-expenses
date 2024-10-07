import axios from "axios";
import { getRecordsForChat } from "~/server/models/records";
import _ from "gpt-3-encoder"
import { OpenAIChatMessage } from "~/utils/types";
import {format, startOfMonth, subDays} from 'date-fns'
import {getAssets} from "~/server/models/assets";

async function fetchRecords(key: string, circleId: string, startDate: string, endDate: string) {
    let now = new Date()

    let curStartDate = startDate
    let curEndDate = endDate

    if(curStartDate && curEndDate) {
        let dtStart = new Date(curStartDate)
        let dtEnd = new Date(curEndDate)

        let diffInTime: number = dtEnd.getTime() - dtStart.getTime()
        let diffInDays: number = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > 90) {
            curStartDate = format(subDays(dtEnd, 90), 'yyyy-MM-dd HH:mm')
            curEndDate = format(dtEnd, 'yyyy-MM-dd HH:mm')
        }
    }
    let params = {
        start: curStartDate ?? format(startOfMonth(now), 'yyyy-MM-dd HH:mm'),
        end: curEndDate ?? format(now, 'yyyy-MM-dd HH:mm')
    }

    let records = await getRecordsForChat(key, params, circleId)
    return records
}

async function fetchAssets(key: string, circleId: string) {
    return getAssets(key, circleId)
}

async function fetchChatCompletions(event: any, messages: any) {
    let functions = [
        {
            "name": "get_transaction_records",
            "description": "Get the user transactions records such as expenses and income, to get the total sum amount and category has type for debt or income, default is expenses",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "the key for search the description, should referenced for searching specific description"},
                    "startDate": {"type": "string", "description": "start date of the records with format yyyy-MM-dd HH:mm"},
                    "endDate": {"type": "string", "description": "end date of the records with format yyyy-MM-dd HH:mm"},
                },
            },
        },
        {
            "name": "get_assets_portfolio",
            "description": "Get the user assets or portfolio such as balances and investment",
            "parameters": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "the key for search the assets name, should referenced for searching specific assets name"},
                },
            },
        }
    ]

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "model": "gpt-4o-mini",
                "messages": messages,
                "functions": functions,
                "function_call": "auto",
                "stream": true
            }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        let message: OpenAIChatMessage = { role : '', content: null, function_call: undefined }
        let choices: { message: OpenAIChatMessage } = {
            message
        }

        const dataObjs = []
        let buffer = new Uint8Array(512);
        let bufferIdx = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;

            for (let i = 0; i < value.byteLength; ++i)
            {
                // Write to the buffer until we reach a double new-line
                // delimiter
                buffer[bufferIdx++] = value[i];

                if (bufferIdx >= 2 && value[i] == 10 && buffer[bufferIdx - 2] == 10)
                {
                    // Handle one data object
                    const lineBuffer = buffer.subarray(0, bufferIdx - 2);
                    const line = decoder.decode(lineBuffer);

                    // Each line starts with a "data: " prefix, followed by
                    // the actual data, which is usually a JSON object
                    if (line.indexOf('data: ') !== 0)
                        throw new Error('Expected "data:" prefix in: ' + line);

                    // Trim the "data: " prefix
                    const dataStr = line.substring(6);

                    // Stop if we reached the end of the stream
                    if (dataStr === '[DONE]'){
                        break;
                    }

                    // Parse and handle data
                    const dataObj = JSON.parse(dataStr);
                    dataObjs.push(dataObj)

                    if(dataObj.choices.length > 0) {
                        const delta = dataObj.choices[0].delta
                        if(!message.role && delta.role) {
                            message.role = delta.role
                        }

                        if(delta.content) {
                            message.content += delta.content
                            event.res.write(delta.content);
                        }

                        if(delta.function_call) {
                            if(!message.function_call) {
                                message.function_call = {name: '', arguments: ''}
                            }

                            if(delta.function_call.name) {
                                message.function_call.name += delta.function_call.name
                            }

                            if(delta.function_call.arguments) {
                                message.function_call.arguments += delta.function_call.arguments
                            }
                        }
                    }
                    // Handle data...

                    // Reset buffer and continue reading
                    bufferIdx = 0;
                }
            }
        }

        return choices
    } catch (e) {
        console.log(e)
        throw e
    }
}

export default defineEventHandler(async (event) => {
    const { messages } = await readBody(event);
    setResponseHeader(event, 'Content-Type', 'text/event-stream');
    setResponseHeader(event, 'Cache-Control', 'no-cache');
    setResponseHeader(event, 'Connection', 'keep-alive');

    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    try {
        const result =  await fetchChatCompletions(event, messages)

        let responseMessage = result?.message

        if (responseMessage?.function_call) {

            const availableFunctions: any = {
                get_transaction_records: fetchRecords,
                get_assets_portfolio: fetchAssets,
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

            // const encoded = _.encode(functionResponse)
            // const encodedLength = encoded.length;
            messages.push(responseMessage);

            if(JSON.parse(functionResponse).length > 80) {
                messages.push({
                    "role": "function",
                    "name": functionName,
                    "content": "Response to user that the data is too big to be process, ask them to use a small date range like 1 month.",
                });
            } else {
                messages.push({
                    "role": "function",
                    "name": functionName,
                    "content": functionResponse,
                });
            }

            await fetchChatCompletions(event, messages)
        }
        event.res.end();

        return { message: 'OK' };
    } catch (e) {
        console.log(e)
        throw createError({
            status: 400,
            message: e?.message ?? "Something went wrong",
        });
    }
});
