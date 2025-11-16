import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

/**
 * Retorna uma instância singleton do cliente GoogleGenAI.
 * Ele inicializa o cliente na primeira chamada, o que ajuda a garantir
 * que process.env.API_KEY esteja disponível.
 */
export const getAiClient = (): GoogleGenAI | null => {
  if (ai) {
    return ai;
  }

  const apiKey = process.env.API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } else {
    console.warn("Chave de API do Gemini não encontrada. Os recursos de IA serão desativados.");
    return null;
  }
};
