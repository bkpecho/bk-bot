import { GoogleGenerativeAI } from "@google/generative-ai";

// Cache the model instance
let cachedModel: any; // TODO: Replace this with redis caching in the future

async function getGeminiModel() {
  const api_key = useRuntimeConfig().api_key;

  if (!api_key) {
    throw new Error(
      "Missing Gemini API key. Please set it in your environment variables.",
    );
  }

  if (!cachedModel) {
    const genAI = new GoogleGenerativeAI(api_key);
    cachedModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  return cachedModel;
}

export { getGeminiModel };
