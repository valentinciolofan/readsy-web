import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Parse the prompt and conversation history from the request body
    const { prompt, conversationHistory = [] } = JSON.parse(event.body);

    // Flatten the conversation into a single string to fit the API's expected input format
    const formattedContext = conversationHistory
        .map(entry => `${entry.role === 'user' ? 'User' : 'Bot'}: ${entry.content}`)
        .join('\n') + `\nUser: ${prompt}`;

    try {
        // Send the formatted context to the AI model
        const result = await model.generateContent(formattedContext);

        return {
            statusCode: 200,
            body: JSON.stringify({ text: result.response.text() }),
        };
    } catch (error) {
        console.error("Error calling GoogleGenerativeAI API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate response" }),
        };
    }
};
