import { GoogleGenerativeAI } from "@google/generative-ai";
import { parse, serialize } from "cookie";

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

  const query = getQuery(event);
  const msg = query.text;

  const cookies = parse(event.req.headers.cookie || "");

  //@ts-ignore
  const chatHistory = JSON.parse(cookies.chatHistory || "[]");

  // Start the chat with the history
  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  //@ts-ignore
  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const returnText = response.text();

  // Update chat history
  chatHistory.push({ role: "user", parts: [{ text: msg }] });
  chatHistory.push({ role: "model", parts: [{ text: returnText }] });

  // Update cookies with new history
  event.res.setHeader(
    "Set-Cookie",
    serialize("chatHistory", JSON.stringify(chatHistory), {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 5,
    }),
  );

  return returnText;
});
