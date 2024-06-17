import { getGeminiModel } from "~/lib/geminiClient";

export default defineEventHandler(async (event) => {
  const model = await getGeminiModel();

  const { prompt, imageParts } = await readBody(event);

  try {
    const result = await model.generateContent([prompt, [...imageParts]]);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `${error}`,
    });
  }
});
