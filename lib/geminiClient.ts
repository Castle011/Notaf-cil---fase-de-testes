import { GoogleGenAI } from "@google/genai";

// Custom error for when the API key is not configured.
export class ApiKeyNotSetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiKeyNotSetError";
  }
}

/**
 * Creates and returns a new instance of the GoogleGenAI client.
 * This ensures the most up-to-date API key from the environment is used for each call.
 * @throws {ApiKeyNotSetError} if the API_KEY environment variable is not set.
 */
export const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    const errorMsg = "Gemini API key not found. Please select a key using the prompt.";
    console.error(errorMsg);
    throw new ApiKeyNotSetError("Chave de API do Gemini não encontrada. Por favor, selecione uma chave.");
  }

  // Create a new client for each request to ensure it uses the latest key.
  return new GoogleGenAI({ apiKey });
};
