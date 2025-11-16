import { GoogleGenAI } from "@google/genai";

// Configura a Vercel para executar esta função como uma edge function para respostas mais rápidas.
export const config = {
  runtime: 'edge',
};

// O manipulador principal para a função serverless.
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
      return new Response(JSON.stringify({ error: 'A chave de API não foi configurada no servidor. Adicione a variável de ambiente API_KEY nas configurações do projeto Vercel.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const body = await req.json();
    const { model, contents, config } = body;

    const result = await ai.models.generateContent({ model, contents, config });

    // Extrai os dados necessários da resposta para garantir que sejam serializáveis.
    const response = {
        text: result.text,
        functionCalls: result.functionCalls,
        rawContent: result.candidates?.[0]?.content,
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in Gemini proxy:', error);
    return new Response(JSON.stringify({ error: error.message || 'Ocorreu um erro interno no servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
