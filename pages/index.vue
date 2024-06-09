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
const focusInput = ref(null);
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
    }, 500);

    response = await $fetch(`/api/chat`, {
      method: "POST",
      body: {
        text: input,
        history: store.getHistoryOnly,
      },
    });
  } catch (error) {
    console.error(error);
    store.messageReceived(`${error}`, getCurrentTime());
  } finally {
    store.messageReceived(response, getCurrentTime());

    isLoading.value = false;
    await nextTick();
    focusInput.value.focus();
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
                <NuxtImg
                  :alt="chat.role"
                  :src="
                    chat.role === 'user'
                      ? 'https://cdn-icons-png.flaticon.com/512/6780/6780628.png'
                      : 'https://cdn-icons-png.flaticon.com/512/6134/6134346.png'
                  "
                />
              </div>
            </div>
            <!-- Chat Header -->
            <div class="chat-header">
              {{ chat.role === "user" ? "User" : "Bot" }}
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
            ref="focusInput"
            v-model="userInput"
            type="text"
            placeholder="Aa"
            class="w-full max-w-xs mr-2 input input-bordered input-primary"
            :disabled="isLoading"
            :autofocus="!isLoading"
            @keydown.enter="sendMessage"
          />
          <button class="btn btn-primary" @click="sendMessage">
            <Icon name="mdi:send" />
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
