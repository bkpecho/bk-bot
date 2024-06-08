import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const api_key = useRuntimeConfig().api_key;

  if (!api_key) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing API key",
    });
  }

  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { text, history } = await readBody(event);

  // Start the chat with the history
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  //@ts-ignore
  const result = await chat.sendMessage(text);
  const response = await result.response;
  const returnText = response.text();

  return returnText;
});
