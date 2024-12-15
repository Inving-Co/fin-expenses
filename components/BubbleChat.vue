<template>
  <div class="chat-container hidden md:block" :class="{ 'expanded': isExpanded }" style="z-index: 5;">
    <div v-if="!isExpanded" @click="isExpanded = true" 
         class="collapsed-chat flex flex-col flex-grow max-w-xl h-[45px] w-80 bg-white dark:bg-gray-800 shadow-xl rounded-t-md overflow-hidden z-20 cursor-pointer">
      <div class="flex justify-between items-center px-2 py-2">
        <div class="text-gray-700 dark:text-gray-200 font-semibold">
          Chat with Inving AI
        </div>
        <button
            class="h-[30px] p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none font-medium rounded-lg text-sm"
            type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>
        </button>
      </div>
    </div>

    <div v-show="isExpanded"
         :style="{ height: `${chatHeight}px`, width: `${chatWidth}px` }"
         class="expanded-chat flex flex-col flex-grow max-w-xl shadow-xl rounded-t-lg overflow-hidden z-50 bg-white dark:bg-gray-800 relative">
      <div class="resize-handle" @mousedown="startResize"></div>
      <div class="flex justify-between items-center px-2 py-2 border-b border-gray-200 dark:border-gray-700">
        <div class="text-gray-700 dark:text-gray-200 font-semibold">
          Chat with Inving AI
        </div>
        <button
            class="h-[30px] p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none font-medium rounded-lg text-sm"
            type="button" @click="isExpanded = false" :disabled="isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="rotate-180" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>
        </button>
      </div>
      <div ref="chatContainer" class="flex flex-col flex-grow h-0 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div v-for="message of messages.filter((val) => val.role !== 'system')" :class="classBubblePositionType[message.role]">
          <div v-if="message.role === 'assistant'" class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 justify-center">
            <NuxtImg class="h-10 w-10 p-3 py-[14px]" src="/app_icon.png" alt="app icon" />
          </div>
          <div>
            <div :class="classBubbleType[message.role]">
              <div class="text-sm whitespace-pre-wrap markdown-body dark:markdown-body-dark" v-html="renderMarkdown(message.content)"></div>
            </div>
          </div>
        </div>
      </div>

      <icons-circular-indicator v-if="isLoading" class="inline w-6 h-6 my-2 text-primary-500 self-center animate-spin"/>
      <div class="flex items-center bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 gap-4 p-4">
        <button
            class="h-[30px] p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none font-medium rounded-lg text-sm"
            type="button" @click="onClear" >
          <icons-refresh class="inline" />
        </button>
        <input :readonly="isLoading" v-model="messageField" 
               class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
               type="text"
               placeholder="Type your message…" @keydown.enter="onSave">
        <button
            class="h-[30px] p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none font-medium rounded-lg text-sm"
            type="button" @click="onSave" :disabled="isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.815 12.197l-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395Z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCircleUsers} from "~/composables/circles";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const messageField = ref<string>('')
const messages = useMessages()

import { ref } from 'vue'

const chatHeight = ref(400);
const chatWidth = ref(320);
const isResizing = ref(false);
const startX = ref(0);
const startY = ref(0);
const startHeight = ref(0);
const startWidth = ref(0);

const startResize = (event: any) => {
  isResizing.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;
  startHeight.value = chatHeight.value;
  startWidth.value = chatWidth.value;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
};

const resize = (event: any) => {
  if (!isResizing.value) return;
  const deltaX = startX.value - event.clientX;
  const deltaY = startY.value - event.clientY;
  chatHeight.value = Math.max(200, startHeight.value + deltaY);
  chatWidth.value = Math.max(200, startWidth.value + deltaX);
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
};

onMounted(() => {
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
});

const chatContainer = ref<any>()
const isLoading = ref<boolean>(false)
const isExpanded = ref<boolean>(false)
const $circleSelector = useCircleUsers()

const classBubblePositionType: { assistant: string, user: string } = {
	assistant: "flex w-full mt-2 space-x-3 max-w-xs",
	user: "flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
}

const classBubbleType: { assistant: string, user: string } = {
	assistant: "bg-gray-200 dark:bg-gray-700 p-3 rounded-r-lg rounded-bl-lg",
	user: "bg-primary-600 text-white p-3 rounded-l-lg rounded-br-lg"
}

watch(() => $circleSelector.value.selected, (value) => {
  messages.value.push({
    role: "system",
    content: `
<internal_reminder>    
  You are Kluarga AI, YOU MUST FOLLOW ALL following IMPORTANT instructions:

  <kluarga_ai_info>
    - Kluarga AI are an innovative Professional Accountant of ${value?.name || ''}.
    - Today's date is ${new Date().toDateString()}. 
    - Kluarga AI task is to create inventive financial management methods for the community of ${value?.name || ''}.
    - Kluarga AI must focus on the following areas:
        1. Budgeting
        2. Investment strategies
        3. Risk management
  </kluarga_ai_info>

  Please respond to the user's financial management questions or requests for advice following these guidelines. Be creative, practical, and considerate of the community's specific needs.

  <kluarga_ai_md>
    - Kluarga AI uses markdown to format table responses.
    - Kluarga AI must FOLLOW THIS MARKDOWN structure to enhance readability:
      1. Using headers (# ## ###) for main points and subpoints
      2. Utilizing **bold** and *italic* for emphasis
      3. Employing bullet points or numbered lists for itemized information
      4. Using \`code blocks\` for financial figures or calculations
      5. Creating tables when presenting comparative data
      6. When using tables, always use ASCII-style tables. For example:
        +------------+-----------+-------------+
        | Category   | Budget    | Actual      |
        +------------+-----------+-------------+
        | Income     | $5,000    | $5,200      |
        | Expenses   | $4,500    | $4,300      |
        | Savings    | $500      | $900        |
        +------------+-----------+-------------+
    - Ensure your response is well-structured and easy to read using these markdown elements.
  </kluarga_ai_md>

  <forming_correct_responses>
   - Kluarga AI MUST evaluate whether to REFUSE or WARN the user based on the query.
   - When presented with a math problem, logic problem, or other problem benefiting from systematic thinking, Kluarga AI thinks through it step by step before giving its final answer.
   - When writing an answer, Kluarga AI follows the instructions laid out in the Kluarga <kluarga_ai_md /> section above.
   - Kluarga AI is grounded in TRUTH which comes from its domain knowledge. Kluarga AI uses domain knowledge if it is relevant to the user query.
   - Other than domain knowledge and specific names and citations, your answer must be written in the same language as the question.
   - Implements accessibility best practices.
   - ALL DOMAIN KNOWLEDGE USED BY Kluarga AI MUST BE CITED.
   - REFUSAL_MESSAGE = "I'm sorry. I'm not able to assist with that."
   - WARNING_MESSAGE = "I'm mostly focused on ... but ..."
   - Kluarga AI MUST NOT apologize or provide an explanation for refusals.
   - If the user asks for CURRENT information or RECENT EVENTS outside of DOMAIN KNOWLEDGE, Kluarga AI responds with a refusal message as it does not have access to real-time data. Only the current time is available. When refusing, Kluarga AI MUST NOT apologize or provide an explanation for the refusal. Kluarga AI simply states "I'm sorry. I'm not able to assist with that.".

    <warnings>
      If the user query pertains to information that is outside of Kluarga AI's DOMAIN KNOWLEDGE, Kluarga AI adds a warning to the response before answering.
    </warnings>

  </forming_correct_responses>

<internal_reminder>
`
  });
});

const renderMarkdown = (content) => {
  const rawMarkup = marked(content);
  return DOMPurify.sanitize(rawMarkup);
};

const onClear = () => {
  messages.value = []
  messageField.value = ''
}

const onSave = async () => {
	if (!messageField.value) return

	isLoading.value = true

	messages.value.push({ role: "user", content: messageField.value })

	messageField.value = ''

	await new Promise(resolve => setTimeout(resolve, 50));

	const lastMessageContainer = chatContainer.value?.lastElementChild;
	lastMessageContainer.scrollIntoView({ behavior: 'smooth' });

	const response = await fetch('/api/openai/create.chat.openai', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			messages: messages.value
		})
	})

	messages.value.push({ role: "assistant", content: '', })

	const reader = response?.body?.pipeThrough(new TextDecoderStream()).getReader()
	while (true) {
		const {value, done} = await reader.read();
		if (done) {
			isLoading.value = false
			lastMessageContainer.scrollIntoView({ behavior: 'smooth' });
			break
		};

		const lastMessage = messages.value[messages.value.length - 1];
		lastMessage.content += value;

		messages.value[messages.value.length - 1] = lastMessage
	}

}

</script>

<style scoped>
.markdown-body, .markdown-body-dark {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6,
.markdown-body-dark h1, .markdown-body-dark h2, .markdown-body-dark h3, .markdown-body-dark h4, .markdown-body-dark h5, .markdown-body-dark h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1, .markdown-body-dark h1 { font-size: 2em; }
.markdown-body h2, .markdown-body-dark h2 { font-size: 1.5em; }
.markdown-body h3, .markdown-body-dark h3 { font-size: 1.25em; }
.markdown-body h4, .markdown-body-dark h4 { font-size: 1em; }
.markdown-body h5, .markdown-body-dark h5 { font-size: 0.875em; }
.markdown-body h6, .markdown-body-dark h6 { font-size: 0.85em; }

.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body table, .markdown-body pre,
.markdown-body-dark p, .markdown-body-dark blockquote, .markdown-body-dark ul, .markdown-body-dark ol, .markdown-body-dark dl, .markdown-body-dark table, .markdown-body-dark pre {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

.markdown-body-dark code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(255,255,255,0.1);
  border-radius: 3px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body-dark pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #1f2937;
  border-radius: 3px;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-body-dark blockquote {
  padding: 0 1em;
  color: #9ca3af;
  border-left: 0.25em solid #4b5563;
}

.markdown-body ul, .markdown-body ol,
.markdown-body-dark ul, .markdown-body-dark ol {
  padding-left: 2em;
}

.markdown-body table,
.markdown-body-dark table {
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body table th, .markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body-dark table th, .markdown-body-dark table td {
  padding: 6px 13px;
  border: 1px solid #4b5563;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body-dark table tr:nth-child(2n) {
  background-color: #1f2937;
}

.markdown-body img,
.markdown-body-dark img {
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.markdown-body-dark hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #4b5563;
  border: 0;
}

.chat-container {
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 40;
}

.expanded-chat {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 40;
}

.collapsed-chat {
  position: relative;
  z-index: 40;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  cursor: nwse-resize;
}
</style>
