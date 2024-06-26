import { getGeminiModel } from "~/lib/geminiClient";

export default defineEventHandler(async (event) => {
  interface ImageData {
    data: string;
    mimeType: string;
  }

  const model = await getGeminiModel();

  const { prompt, imageParts } = await readBody(event);

  const imageData = imageParts.map((image: ImageData) => {
    return {
      inlineData: image,
    };
  });

  try {
    const result = await model.generateContent([prompt, ...imageData]);
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
