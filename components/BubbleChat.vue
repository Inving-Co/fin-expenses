<template>
  <div class="chat-container" :class="{ 'expanded': isExpanded }">
    <div v-if="!isExpanded" @click="isExpanded = true" class="collapsed-chat flex flex-col flex-grow max-w-xl h-[45px] w-80 dark:bg-gray-50 bg-gray-900 shadow-xl rounded-t-md overflow-hidden z-20 cursor-pointer">
      <div class="flex justify-between items-center px-2 py-2">
        <div class="text-gray-200 dark:text-gray-500 font-semibold">
          Chat with Inving AI
        </div>
        <button
            class="h-[30px] p-1 text-gray-200 focus:outline-none font-medium rounded-lg text-sm dark:text-gray-500"
            type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>
        </button>
      </div>
    </div>

    <div v-show="isExpanded"
         :style="{ height: `${chatHeight}px`, width: `${chatWidth}px` }"
         class="expanded-chat flex flex-col flex-grow max-w-xl shadow-xl rounded-t-lg overflow-hidden z-50 dark:bg-gray-50 bg-gray-900 relative">
      <div class="resize-handle" @mousedown="startResize"></div>
      <div class="flex justify-between items-center px-2 py-2">
        <div class="text-gray-200 dark:text-gray-500 font-semibold">
          Chat with Inving AI
        </div>
        <button
            class="h-[30px] p-1 text-gray-200 focus:outline-none font-medium rounded-lg text-sm dark:text-gray-500"
            type="button" @click="isExpanded = false" :disabled="isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="rotate-180" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>
        </button>
      </div>
      <div ref="chatContainer" class="flex flex-col flex-grow h-0 p-4 overflow-auto border-t bg-gray-200">
        <div v-for="message of messages.filter((val) => val.role !== 'system')" :class="classBubblePositionType[message.role]">
          <div v-if="message.role === 'assistant'" class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 justify-center">
            <NuxtImg class="h-10 w-10 p-3 py-[14px]" src="/app_icon.png" alt="app icon" />
          </div>
          <div>
            <div :class="classBubbleType[message.role]">
              <div class="text-sm whitespace-pre-wrap markdown-body" v-html="renderMarkdown(message.content)"></div>
            </div>
          </div>
        </div>
      </div>

      <icons-circular-indicator v-if="isLoading" class="inline w-6 h-6 my-2 text-primary-500 self-center animate-spin"/>
      <div class="flex items-center bg-gray-300 gap-4 p-4">
        <button
            class="h-[30px] p-1 text-gray-500 focus:outline-none font-medium rounded-lg text-sm"
            type="button" @click="onClear" >
          <icons-refresh class="inline " />
        </button>
        <input :readonly="isLoading" v-model="messageField" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-800 dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text"
               placeholder="Type your message…" @keydown.enter="onSave">
        <button
            class="h-[30px] p-1 text-gray-500 focus:outline-none font-medium rounded-lg text-sm"
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
	assistant: "bg-gray-300 p-3 rounded-r-lg rounded-bl-lg",
	user: "bg-primary-600 text-white p-3 rounded-l-lg rounded-br-lg"
}

watch(() => $circleSelector.value.selected, (value) => {
  messages.value.push({
    role: "system",
    content: `You are an innovative accountant. Today's date is ${new Date().toDateString()}. Your task is to create inventive financial management methods for the community of ${value?.name || ''}. Focus on the following areas:

1. Budgeting
2. Investment strategies
3. Risk management

Additionally, provide occasional advice on tax laws to maximize client earnings.

Please respond to the user's financial management questions or requests for advice following these guidelines. Be creative, practical, and considerate of the community's specific needs.

Important: Use markdown formatting in your responses to enhance readability. This includes:
- Using headers (# ## ###) for main points and subpoints
- Utilizing **bold** and *italic* for emphasis
- Employing bullet points or numbered lists for itemized information
- Using \`code blocks\` for financial figures or calculations
- Creating tables when presenting comparative data

When using tables, always use ASCII-style tables. For example:

+------------+-----------+-------------+
| Category   | Budget    | Actual      |
+------------+-----------+-------------+
| Income     | $5,000    | $5,200      |
| Expenses   | $4,500    | $4,300      |
| Savings    | $500      | $900        |
+------------+-----------+-------------+

Ensure your response is well-structured and easy to read using these markdown elements.`
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
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; }
.markdown-body h2 { font-size: 1.5em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: 0.875em; }
.markdown-body h6 { font-size: 0.85em; }

.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body table, .markdown-body pre {
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

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 2em;
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body table th, .markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body img {
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
