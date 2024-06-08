<script setup>
import { ref } from "vue";
import date from "date-and-time";
import markdownit from "markdown-it";
import { useChatStore } from "~/stores/useChatStore";

const store = useChatStore();
const md = markdownit();

// TODO: place this on utils or something
const getCurrentTime = () => {
  const now = new Date();
  const currentTime = date.format(now, "hh:mm:ss A");
  return currentTime;
};

const userInput = ref("");
const userMessage = ref({});
const botMessage = ref({});
const isLoading = ref(false);
const chatHistory = store.chatHistory;

async function sendMessage() {
  if (userInput.value.trim() === "") return;

  userMessage.value = {
    role: "user",
    parts: [{ text: userInput.value }],
    date: getCurrentTime(),
  };

  store.saveChatHistory(userMessage.value);

  let response = "";

  try {
    isLoading.value = true;

    const input = userInput.value;
    userInput.value = "";

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 500);

    // show bot typing indicator
    botMessage.value = {
      role: "model",
      parts: [{ text: "replying" }],
      date: getCurrentTime(),
    };

    setTimeout(() => {
      store.saveChatHistory(botMessage.value);
    }, 1000);

    response = await $fetch(`/api/chat`, {
      method: "POST",
      body: {
        text: input,
        history: store.getHistoryOnly,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    store.messageReceived(response);

    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar class="sticky top-0" />
    <div class="flex items-stretch justify-center flex-grow">
      <div class="flex-1 max-w-[768px] p-4 pb-10">
        <div class="relative overflow-auto min-h-[96%] pb-10">
          <div
            v-if="chatHistory.length === 0"
            class="text-center absolute opacity-50 text-2xl translate-y-[-50%] top-[45%] min-w-full"
          >
            <p>Type Something...</p>
          </div>
          <div
            v-for="(chat, index) in chatHistory"
            :key="chat.id"
            :class="{
              'chat-end': chat.role === 'user',
              'chat-start': chat.role === 'model',
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
              class="chat-bubble text-l"
              :class="{
                'chat-bubble-primary': chat.role === 'user',
                'chat-bubble-secondary': chat.role === 'model',
              }"
            >
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="md.render(chat.parts[0].text)" />
            </div>
            <!-- Chat Footer -->
            <div className="chat-footer opacity-50">
              {{
                chat.role === "user"
                  ? `Sent ${chat.date}`
                  : chat.role === "model" &&
                      chatHistory.length - 1 === index &&
                      isLoading === true
                    ? `Typing...`
                    : `Received ${chat.date}`
              }}
            </div>
          </div>
        </div>
        <div class="sticky flex justify-center bottom-10">
          <input
            v-model="userInput"
            type="text"
            placeholder="Aa"
            class="w-full max-w-xs mr-2 input input-bordered input-primary"
            @keydown.enter="sendMessage"
          />
          <button class="btn" @click="sendMessage">
            <Icon name="mdi:send" color="purple" />
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
