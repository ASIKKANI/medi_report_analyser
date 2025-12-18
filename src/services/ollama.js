export const generateOllamaResponse = async (prompt, model, baseUrl = 'http://localhost:11434') => {
    try {
        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            }),
        });

        if (!response.ok) {
            // Check for CORS error or connection refused
            throw new Error(`Ollama Error: ${response.statusText}. Make sure Ollama is running and CORS is allowed.`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Ollama Service Error:", error);
        throw error;
    }
};
