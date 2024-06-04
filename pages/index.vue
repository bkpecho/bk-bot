<script setup>
import { ref } from "vue";
import date from "date-and-time";

// TODO: place this on utils or something
const getCurrentTime = () => {
	const now = new Date();
	const currentTime = date.format(now, "hh:mm:ss A");
	return currentTime;
};

const userInput = ref("");
const userMessage = ref({});
const chatHistory = ref([]);
const isLoading = ref(false);

async function sendMessage() {
	if (userInput.value.trim() === "") return;

	userMessage.value = {
		role: "user",
		parts: [{ text: userInput.value }],
		date: getCurrentTime(),
	};

	chatHistory.value.push(userMessage.value);

	let response = "";

	try {
		isLoading.value = true;

		const input = userInput.value;
		userInput.value = "";

		setTimeout(() => {
			chatHistory.value.push({
				role: "bot",
				parts: [{ text: "replying" }],
				date: getCurrentTime(),
			});
		}, 1000);

		response = await $fetch(`/api/chat?text=${encodeURIComponent(input)}`, {
			method: "POST",
			body: userMessage.value,
		});
	} catch (error) {
		console.log(error);
	} finally {
		chatHistory.value.pop({
			role: "bot",
			parts: [{ text: response }],
			date: getCurrentTime(),
		});

		isLoading.value = false;
	}

	chatHistory.value.push({
		role: "bot",
		parts: [{ text: response }],
		date: getCurrentTime(),
	});
}
</script>

<template>
	<div><a class="link link-primary" href="https://github.com/bkpecho/bk-bot">Github Repo</a></div>
	<div class="">
		<div class="min-h-[540px] max-h-[540px] overflow-auto">
			<div
				v-if="chatHistory.length === 0"
				class="fixed top-[30%] text-center min-w-full opacity-50 text-2xl"
			>
				Type Something...
			</div>
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

				<!-- Chat Header -->
				<div class="chat-header">
					{{ chat.role === "user" ? "Bryan" : "Dezza" }}
				</div>

				<!-- Chat Message -->
				<Typing v-if="chat.parts[0].text === 'replying'" />
				<div
					v-else
					class="chat-bubble"
					:class="{
						'chat-bubble-primary': chat.role === 'user',
						'chat-bubble-secondary': chat.role === 'bot',
					}"
				>
					{{ chat.parts[0].text }}
				</div>

				<!-- Chat Footer -->
				<div className="chat-footer opacity-50">
					{{
						chat.role === "user"
							? `Sent ${chat.date}`
							: chat.role === "bot" && isLoading === true
							? `Typing...`
							: `Received ${chat.date}`
					}}
				</div>
			</div>
		</div>
		<div class="flex justify-center">
			<input
				type="text"
				placeholder="Aa"
				class="input input-bordered input-primary w-full max-w-xs mr-2"
				v-model="userInput"
				@keydown.enter="sendMessage"
			/>
			<button @click="sendMessage" class="btn">
				<Icon name="mdi:send" color="purple" />
				Send
			</button>
		</div>
	</div>
</template>
