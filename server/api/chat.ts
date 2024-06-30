import { getGeminiModel } from "~/lib/geminiClient";

export default defineEventHandler(async (event) => {
  const model = await getGeminiModel();

  const { text, history } = await readBody(event);

  const initialHistory = [
    {
      role: "user",
      parts: [
        {
          text: "Imagine you are a helpful companion. A user says to you, 'I may send chats or chats with images from time to time. Make sure to remember everything we've talked about because I will ask you about all of the things I send you, whether chat or image. Keep your answers concise, helpful, and friendly, without sounding too cold or overly bubbly.",
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Feel free to ask about anything you've sent my way!" }],
    },
  ];

  try {
    // Start the chat with the history
    const chat = model.startChat({
      history: [...initialHistory, ...history],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    //@ts-ignore
    const result = await chat.sendMessage(text);
    const response = await result.response;
    const returnText = response.text();

    return returnText;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `${error}`,
    });
  }
});
