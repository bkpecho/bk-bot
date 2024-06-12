import { getGeminiModel } from "~/lib/geminiClient";

export default defineEventHandler(async (event) => {
  const model = await getGeminiModel();

  const { text, history } = await readBody(event);

  try {
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
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `${error}`,
    });
  }
});
