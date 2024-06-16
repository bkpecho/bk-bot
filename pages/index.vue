<script setup>
import { ref } from "vue";
import markdownit from "markdown-it";
import { getCurrentTime } from "~/utils/getCurrentTime";
import { useChatStore } from "~/stores/useChatStore";

// components
import ImagePreview from "~/components/chat/imagePreview.vue";
import Typing from "~/components/chat/typing.vue";
import Navbar from "~/components/chat/navbar.vue";

const store = useChatStore();
const md = markdownit();

const userInput = ref("");
const userMessage = ref({});
const botMessage = ref({});
const isLoading = ref(false);
const focusInput = ref(null);
const fileInput = ref(null);
const chatHistory = store.chatHistory;
const imageData = ref({ name: "", type: "", size: "", url: "" });

async function sendMessage(event) {
  if (event.key === "Enter" && event.shiftKey) {
    // Check for Shift + Enter
    const textarea = this.$refs.myTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert a new line character at the cursor position
    textarea.value =
      textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);

    // Adjust cursor position after inserting the new line
    textarea.selectionStart = textarea.selectionEnd = start + 1;

    event.preventDefault();
  }

  if (userInput.value.trim() === "") return;

  userMessage.value = {
    role: "user",
    parts: [
      {
        text: `${userInput.value}`,
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

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  console.log("Selected Files:", selectedFile);

  console.log("File Name:", selectedFile.name);
  console.log("File Size:", selectedFile.size);
  console.log("File Type:", selectedFile.type);

  const reader = new FileReader();
  reader.onload = (e) => {
    imageData.value = {
      name: selectedFile.name.toUpperCase(),
      type: selectedFile.type,
      size: (selectedFile.size / 1000).toFixed(2) + "kb",
      url: e.target.result,
    };
  };
  reader.readAsDataURL(selectedFile);
};

const clearImagePreview = () => {
  imageData.value = { name: "", url: "", size: "", type: "" };
  if (fileInput.value) {
    fileInput.value.value = null;
  }

  console.log("🗑️ Image Preview Cleared!");
  console.log("File Input:", fileInput.value);
  console.log("Image Data:", imageData.value);
};
</script>

<template>
  <div class="flex flex-col h-screen">
    <Navbar class="sticky top-0 mx-auto" />

    <div class="flex flex-col items-center justify-center flex-grow">
      <!-- Chat History -->
      <div class="flex-1 flex-shrink-0 w-full max-w-[768px] p-4 pb-2">
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
      </div>

      <!-- Chat Input Container -->
      <div
        class="sticky bottom-0 flex flex-col flex-shrink-0 w-full max-w-screen-lg gap-2"
      >
        <!-- Image Preview -->
        <ImagePreview
          :image-data="imageData"
          :clear-image-preview="clearImagePreview"
        />

        <!-- Chat Input -->
        <div class="bg-base-100">
          <label for="chat" class="sr-only">Your message</label>
          <div class="flex items-center px-3 py-2 rounded-lg bg-base-100">
            <!-- File Input -->
            <input
              id="file-upload"
              ref="fileInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleFileChange"
            />
            <!-- Upload Image Button -->
            <button
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 btn btn-circle btn-ghost"
              @click="triggerFileUpload"
            >
              <svg
                class="w-5 h-5 text-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18"
              >
                <path
                  fill="currentColor"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
              </svg>
              <span class="sr-only">Upload image</span>
            </button>
            <!-- Add emoji Button -->
            <button
              type="button"
              class="p-2 text-gray-500 btn btn-circle btn-ghost"
            >
              <svg
                class="w-5 h-5 text-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                />
              </svg>
              <span class="sr-only">Add emoji</span>
            </button>
            <!-- Chat Textarea -->
            <textarea
              id="chat-input"
              ref="focusInput"
              v-model="userInput"
              rows="1"
              class="block w-full px-2 pt-3 mx-4 text-sm rounded-lg ps-4 textarea textarea-primary"
              type="text"
              placeholder="Type chat here..."
              :disabled="isLoading"
              :autofocus="!isLoading"
              @keydown.enter="sendMessage"
            ></textarea>
            <!-- Send Message Button -->
            <button
              class="inline-flex justify-center p-2 btn btn-circle btn-ghost"
              @click="sendMessage"
            >
              <svg
                class="w-5 h-5 rotate-90 rtl:-rotate-90 text-primary"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path
                  d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
                />
              </svg>
              <span class="sr-only">Send message</span>
            </button>
          </div>
          <p class="px-4 pb-2 text-xs text-center opacity-50">
            BK-Bot may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  /* border: 1px solid red; */
}
</style>
