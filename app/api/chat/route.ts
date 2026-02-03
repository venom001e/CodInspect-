import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API Key is missing. Please add it to your .env.local file." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // 🚀 SMART FALLBACK STRATEGY
        // Verified working models: gemini-2.5-flash
        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.0-flash-lite",
            "gemini-flash-latest"
        ];

        let lastError = null;
        let responseText = null;

        // System Prompt
        const systemPrompt = "You are CodInspect AI, an expert Senior Software Engineer. You write clean, modern, and bug-free code. Always use syntax highlighting.";

        // Robust History Formatting
        const chatHistory = history
            .filter((msg: any) => msg.content && msg.content.trim() !== "")
            .map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            }));

        // Inject System Prompt into History
        const finalHistory = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I am CodInspect AI, your Senior Software Engineer. I will provide clean, bug-free code with syntax highlighting." }] },
            ...chatHistory
        ];

        // 🔄 Loop through models
        console.log(`Received request with message length: ${message.length}, history items: ${history.length}`);

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting Gemini with model: ${modelName}`);

                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: finalHistory,
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                responseText = response.text();

                if (responseText) {
                    console.log(`✅ Success with model: ${modelName}`);
                    break;
                }
            } catch (err: any) {
                console.warn(`⚠️ Failed with model ${modelName}:`, err.message);
                lastError = err;

                // Fast-fail if error is critical
                if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("PERMISSION_DENIED")) {
                    console.error("Critical API Error - Stopping fallbacks");
                    break;
                }
            }
        }

        if (!responseText && lastError) {
            console.error("❌ Final error after trying all models:", lastError.message);
            throw lastError;
        }

        return NextResponse.json({ text: responseText });

    } catch (error: any) {
        console.error("Critical Error in Chat API:", error);

        let errorMessage = error.message || "Unknown error occurred";

        // Clean up common error messages for the user
        if (errorMessage.includes("404")) {
            errorMessage = "Model not found or API version mismatch. Please check your project configuration.";
        } else if (errorMessage.includes("429")) {
            errorMessage = "Quota exceeded. Please try again in a moment.";
        }

        return NextResponse.json(
            { error: `Gemini API Error: ${errorMessage}` },
            { status: 500 }
        );
    }
}
