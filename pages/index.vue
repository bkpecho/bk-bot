<script setup>
import { ref } from "vue";
import date from "date-and-time";

// TODO: place this on utils or something
const getCurrentTime = () => {
	const now = new Date();
	const currentTime = date.format(now, "hh:mm:ss A");
	return currentTime;
};

const currentDate = () => {
	console.log(getCurrentTime());
};

const userInput = ref("");
const userMessage = ref({});
const chatHistory = ref([]);

async function sendMessage() {
	if (userInput.value.trim() === "") return;

	userMessage.value = {
		role: "user",
		parts: [{ text: userInput.value }],
		date: getCurrentTime(),
	};

	chatHistory.value.push(userMessage.value);

	const response = await $fetch(`/api/chat?text=${encodeURIComponent(userInput.value)}`, {
		method: "POST",
		body: userMessage.value,
	});

	chatHistory.value.push({
		role: "bot",
		parts: [{ text: response }],
		date: getCurrentTime(),
	});

	userInput.value = "";
}
</script>

<template>
	<button :onclick="currentDate">Joe</button>
	<h1>BK Chat</h1>
	<div class="chatHistory">
		<div
			v-for="chat in chatHistory"
			:key="chat.id"
			:class="{
				'chat-end': chat.role === 'user',
				'chat-start': chat.role === 'bot',
			}"
			class="chat"
		>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img
						:alt="chat.role"
						:src="
							chat.role === 'user'
								? 'https://scontent.fpag2-1.fna.fbcdn.net/v/t39.30808-6/344338913_1324229128155706_1621357508965055437_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGiXsPbzWFbxbfLZJ6SHTfBBnrjjdbTwpAGeuON1tPCkD4THTW1NFtDd1CMMZ2xjHUsNc9fG4vazPzjDuU-GlGP&_nc_ohc=wIXUiPmouhwQ7kNvgHeH9hQ&_nc_ht=scontent.fpag2-1.fna&oh=00_AYCamYIJyjTO-G15cMpTePs609rNBlGaqWq5yK6dIOJCMw&oe=6664E818'
								: 'https://scontent.fpag2-1.fna.fbcdn.net/v/t39.30808-1/357402173_3536856133259214_5262858269930229542_n.jpg?stp=c0.0.480.480a_dst-jpg_p480x480&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFW1arI7WuREvoBgbd6w4HvAMO8ESYVBfYAw7wRJhUF9nCcNHo_i-mLkup_Lhfb354c0UKJtPRihTvu_IEW9SJW&_nc_ohc=tupcVimg2IsQ7kNvgEDMg46&_nc_ht=scontent.fpag2-1.fna&oh=00_AYAlXOV2D-ZP2xhutSfJxXiR3P1Oh1KDXOO6hyBOhqSc5w&oe=6664CDD4'
						"
					/>
				</div>
			</div>
			<div class="chat-header">
				{{ chat.role === "user" ? "Bryan" : "Dezza" }}
				<time class="text-xs opacity-50">{{ chat.date }}</time>
			</div>
			<div
				class="chat-bubble"
				:class="{
					'chat-bubble-primary': chat.role === 'user',
					'chat-bubble-secondary': chat.role === 'bot',
				}"
			>
				{{ chat.parts[0].text }}
			</div>
			<div className="chat-footer opacity-50">
				{{ chat.role === "user" ? "Seen" : "Delivered" }}
			</div>
		</div>
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
