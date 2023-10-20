<template>
	<div v-if="!isExpanded" class="flex flex-col flex-grow max-w-xl h-[45px] w-80 dark:bg-gray-50 bg-gray-900 shadow-xl rounded-t-md overflow-hidden z-20">
		<div class="flex justify-between items-center px-2 py-2">
			<div class="text-gray-200 dark:text-gray-500 font-semibold">
				Chat with Inving AI
			</div>
			<button
				class="h-[30px] p-1 text-gray-200 focus:outline-none font-medium rounded-lg text-sm dark:text-gray-500"
				type="button" @click="isExpanded = true" :disabled="isLoading">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>
			</button>
		</div>
	</div>

	<div v-else class="flex flex-col flex-grow max-w-xl h-[50vh] w-80 dark:bg-gray-50 bg-gray-900 shadow-xl rounded-t-lg overflow-hidden z-50">
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
		<div class="flex items-center bg-gray-300 gap-4 p-4">
			<input :readonly="isLoading" v-model="messageField" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-800 dark:focus:ring-primary-500 dark:focus:border-primary-500" type="text"
				placeholder="Type your message…" @keydown.enter="onSave">
			<button
				class="h-[30px] p-1 text-gray-500 focus:outline-none font-medium rounded-lg text-sm"
				type="button" @click="onSave" :disabled="isLoading">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.815 12.197l-7.532 1.255a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.942l18-9a.75.75 0 0 0 0-1.341l-18-9c-.614-.307-1.283.303-1.035.942l2.598 6.958a.5.5 0 0 0 .386.318l7.532 1.255a.2.2 0 0 1 0 .395Z"/></svg>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useCircleUsers} from "~/composables/circles";

const messageField = ref<string>('')
const messages = useMessages()

import { ref } from 'vue'

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
    content: `Assume an innovative accountant's role from today, ${new Date().toDateString()}. Your task is to create inventive financial management methods for community ${value?.name}, considering budgeting, investment strategies, and risk management. Occasionally advise on tax laws to maximize client earnings. Respond to the user's first advice request following these guidelines.`
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
