import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateGeminiResponse = async (apiKey, history, message, context) => {
    if (!apiKey) throw new Error("Gemini API Key is missing. Please add it in settings.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
        history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        })),
    });

    // Prepend context to the message if it's the first message or if appropriate
    // For simpliciy, we'll append context contextually in the component, but here we expect 'message' to be the full user prompt.

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
};
