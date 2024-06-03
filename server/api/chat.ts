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
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

	const query = getQuery(event);
	const msg = query.text;

	const chat = model.startChat({
		history: [],
		generationConfig: {
			maxOutputTokens: 2000,
		},
	});

	//@ts-ignore
	const result = await chat.sendMessage(msg);
	const response = await result.response;
	const text = response.text();

	return text;
});
