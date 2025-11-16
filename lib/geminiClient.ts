import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

/**
 * Retorna uma instância singleton do cliente GoogleGenAI.
 * Ele inicializa o cliente de forma otimista na primeira chamada.
 */
export const getAiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }

  // Inicializa o cliente de forma otimista. A biblioteca lidará com a chave de API ausente na chamada da API.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
};
