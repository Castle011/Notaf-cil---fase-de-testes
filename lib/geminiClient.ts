import { GoogleGenAI } from "@google/genai";

// Esta função deve ser chamada antes de uma chamada de API para garantir
// que a chave de API mais recente do ambiente seja usada.
export const getAiClient = (): GoogleGenAI | null => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        return new GoogleGenAI({ apiKey });
    }
    console.warn("Gemini API key not found. AI features will be disabled.");
    return null;
}
