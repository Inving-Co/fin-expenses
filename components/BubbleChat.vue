<template>
	<div v-if="!isExpanded" class="flex flex-col flex-grow max-w-xl h-[45px] w-80 bg-white shadow-xl rounded-t-lg overflow-hidden z-20">
		<div class="flex justify-between items center mx-2 my-2">
			<div class="text-gray-500 font-semibold">
				Chat with Inving AI
			</div>
			<button
				class="h-[20px] w-[38px] text-gray-500 bg-gray-200 drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
				type="button" @click="isExpanded = true" :disabled="isLoading">
				<svg class="w-full" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 12 12"><path fill="currentColor" d="M2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 2 6Z"/></svg>		
			</button>
		</div>
	</div>

	<div v-else class="flex flex-col flex-grow max-w-xl h-[50vh] w-80 bg-white shadow-xl rounded-t-lg overflow-hidden z-50">
		<div class="flex justify-between items center px-2 py-2">
			<div class="text-gray-500 font-semibold">
				Chat with Inving AI
			</div>
			<button
				class="h-[20px] w-[38px] text-gray-500 bg-gray-200 drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
				type="button" @click="isExpanded = false" :disabled="isLoading">
				<svg class="w-full" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 12 12"><path fill="currentColor" d="M2 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 2 6Z"/></svg>		
			</button>
		</div>
		<div ref="chatContainer" class="flex flex-col flex-grow h-0 p-4 overflow-auto border-t">
			<div v-for="message of messages.filter((val) => val.role !== 'system')" :class="classBubblePositionType[message.role]">
				<div v-if="message.role === 'assistant'" class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 justify-center">
					<NuxtImg class="h-10 w-10 p-3 py-[14px]" src="/app_icon.png" alt="app icon"/></div>
				<div>
					<div :class="classBubbleType[message.role]">
						<p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
					</div>
					<!-- <span class="text-xs text-gray-500 leading-none">2 min ago</span> -->
				</div>
				<!-- <div  v-if="message.role === 'user'" class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div> -->
			</div>
		</div>

		<icons-circular-indicator v-if="isLoading" class="inline w-6 h-6 my-2 text-primary-500 self-center animate-spin"/>
		<div class="bg-gray-300 p-4">
			<input :readonly="isLoading" v-model="messageField" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text"
				placeholder="Type your message…" @keydown.enter="onSave">
		</div>
	</div>
</template>

<script setup lang="ts">
const messageField = ref<string>('')
const messages = useMessages()

import { ref } from 'vue'
import { toast } from 'vue3-toastify';

const chatContainer = ref<any>()
const isLoading = ref<boolean>(false)
const isExpanded = ref<boolean>(false)

const classBubblePositionType: { assistant: string, user: string } = {
	assistant: "flex w-full mt-2 space-x-3 max-w-xs",
	user: "flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
}

const classBubbleType: { assistant: string, user: string } = {
	assistant: "bg-gray-300 p-3 rounded-r-lg rounded-bl-lg",
	user: "bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg"
}

onMounted(() => {
	messages.value.push({
		role: "system",
		content: `Today is ${new Date().toDateString()}, and you're an expert on financials, you should help user on this areas to analyze his data\nYou are an AI for deliver finance reports about their data, here's user data\n\nYou only help user with weekly report, ignore when user want monthly or annualy report`
	});
})

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