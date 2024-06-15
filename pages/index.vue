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
const fileInput = ref(null);
const focusInput = ref(null);
const userMessage = ref({});
const botMessage = ref({});
const isLoading = ref(false);
const chatHistory = store.chatHistory;

async function sendMessage() {
  if (userInput.value.trim() === "") return;

  userMessage.value = {
    role: "user",
    parts: [
      {
        text: `${userInput.value} and the file name is ${fileInput.value.files[0].name}`,
      },
    ],
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

const handleFileChange = (event) => {
  const selectedFiles = event.target.files;

  for (const file of selectedFiles) {
    console.log("File Name:", file.name);
    console.log("File Size:", file.size);
    console.log("File Type:", file.type);
    // Process or upload the file here
    // ... your logic
  }
};

const triggerFileUpload = () => {
  fileInput.value.click();
};
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
            <div class="chat-image avatar">
              <div className="w-10 rounded-full">
                <NuxtImg
                  :src="
                    chat.role === 'user'
                      ? 'https://www.tailframes.com/images/avatar.webp'
                      : 'https://cdn-icons-png.flaticon.com/512/6134/6134346.png'
                  "
                  :alt="chat.role"
                  class="aspect-square"
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
        <div class="sticky flex flex-col gap-2 bottom-4">
          <div class="flex items-center gap-2">
            <label for="chat-input" class="sr-only">Send Message</label>
            <div class="relative w-full">
              <!-- <div
                class="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M6 14h8v-2H6zm0-3h12V9H6zm0-3h12V6H6zM2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm3.15-6H20V4H4v13.125zM4 16V4z"
                  />
                </svg>
              </div> -->
              <input
                id="chat-input"
                ref="focusInput"
                v-model="userInput"
                type="text"
                class="bg-gray-50 py-3.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 block w-full ps-4 p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                placeholder="Type chat here..."
                :disabled="isLoading"
                :autofocus="!isLoading"
                @keydown.enter="sendMessage"
              />
              <!-- Image Upload Button -->
              <button
                type="button"
                class="absolute inset-y-0 flex items-center end-0 pe-3"
                @click="triggerFileUpload"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M13 19c0 .7.13 1.37.35 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v8.35c-.63-.22-1.3-.35-2-.35V5H5v14zm.96-6.71l-2.75 3.54l-1.96-2.36L6.5 17h6.85c.4-1.12 1.12-2.09 2.05-2.79zM20 18v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
                  />
                </svg>
              </button>
            </div>

            <!-- File Input -->
            <input
              id="file-upload"
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileChange"
            />

            <button
              class="py-4 font-normal btn btn-primary"
              @click="sendMessage"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" /></svg
              >Send
            </button>
          </div>

          <p class="text-xs text-center opacity-50">
            BK-Bot may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
