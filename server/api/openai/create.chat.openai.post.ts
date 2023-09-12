import axios from "axios";
import { getRecordsForChat } from "~/server/models/records";
import _ from "gpt-3-encoder"
import { OpenAIChatMessage } from "~/utils/types";

async function fetchRecords(key: string, circleId: string, startDate: string, endDate: string) {
    return getRecordsForChat(key, {
        start: startDate as string,
        end: endDate as string
    }, circleId)
}

async function fetchChatCompletions(event: any, messages: any) {
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
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo-16k",
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
            messages.push({
                "role": "function",
                "name": functionName,
                "content": functionResponse,
            }); 

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
