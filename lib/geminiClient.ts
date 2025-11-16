import { GoogleGenAI } from "@google/genai";

// Custom error for when the API key is not configured.
export class ApiKeyNotSetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiKeyNotSetError";
  }
}

let ai: GoogleGenAI | null = null;

/**
 * Retorna uma instância singleton do cliente GoogleGenAI.
 * Ele inicializa o cliente de forma otimista na primeira chamada.
 * @throws {ApiKeyNotSetError} if the API_KEY environment variable is not set.
 */
export const getAiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Throw a specific error if the key is missing from the environment.
    // This provides a clearer signal to the user about what's wrong.
    console.error("API_KEY environment variable not set. Please set it in your Vercel project settings.");
    throw new ApiKeyNotSetError("A variável de ambiente API_KEY não está configurada.");
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
};
