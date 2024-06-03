<script setup>
import { ref } from "vue";

const userInput = ref("");
const userMessage = ref({});
const chatHistory = ref([]);

async function sendMessage() {
	if (userInput.value.trim() === "") return;
	// history.value.push({ role: "user", text: userInput.value });

	userMessage.value = {
		role: "user",
		parts: [{ text: userInput.value }],
	};

	chatHistory.value.push(userMessage.value);

	const response = await $fetch(`/api/chat?text=${encodeURIComponent(userInput.value)}`, {
		method: "POST",
		body: userMessage.value,
	});

	chatHistory.value.push({
		role: "bot",
		parts: [{ text: response }],
	});

	userInput.value = "";
	// messages.value.push({ role: "bot", text: response.data.text });
}
</script>

<template>
	<h1>BK Chat</h1>
	<div class="chatHistory">
		<p
			v-for="chat in chatHistory"
			:key="chat.id"
			:class="{ user: chat.role === 'user', bot: chat.role === 'bot' }"
		>
			{{ chat.parts[0].text }}
		</p>
	</div>

	<input type="text" v-model="userInput" @keydown.enter="sendMessage" />
	<button @click="sendMessage">Send</button>
</template>

<style>
.user {
	color: red;
	font-size: x-large;
}
.bot {
	color: blue;
	font-size: x-large;
}
</style>
