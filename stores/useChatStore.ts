import { defineStore } from "pinia";

interface ChatHistory {
  role: string;
  parts: { text: string }[];
  date: string;
  imageData?: ImageData;
}

interface ImageData {
  name: string;
  type: string;
  size: string;
  url: string;
  link: string;
}

export const useChatStore = defineStore({
  id: "useChatStore",
  state: () => ({
    chatHistory: [] as ChatHistory[],
  }),
  actions: {
    saveChatHistory(chat: ChatHistory) {
      this.chatHistory.push(chat);
    },
    messageReceived(response: string, currentDate: string) {
      if (this.chatHistory.length > 0) {
        const lastIndex = this.chatHistory.length - 1;
        this.chatHistory[lastIndex].parts[0].text = response;
        this.chatHistory[lastIndex].date = currentDate;
      }
    },
  },
  getters: {
    getHistoryOnly: (state) =>
      state.chatHistory.map((chat) => ({
        role: chat.role,
        parts: chat.parts,
      })),

    getImageParts: (state) =>
      state.chatHistory.map((chat) => ({
        inlineData: {
          data: chat.imageData?.link,
          mimeType: chat.imageData?.type,
        },
      })),
  },
});
