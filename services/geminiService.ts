import { getAiClient } from '../lib/geminiClient';

const prompts = {
    pt: (clientName: string, amount: number, service: string) => `Gere uma breve observação profissional para uma nota fiscal em português. Cliente: "${clientName}", Valor: R$ ${amount.toFixed(2)}, Serviço: "${service}". A observação deve ser concisa e formal.`,
    en: (clientName: string, amount: number, service: string) => `Generate a brief, professional observation for an invoice in English. Client: "${clientName}", Amount: $${amount.toFixed(2)}, Service: "${service}". The observation should be concise and formal.`
};

export const generateInvoiceObservation = async (clientName: string, amount: number, service: string, lang: 'pt' | 'en'): Promise<string> => {
    const prompt = prompts[lang](clientName, amount, service);

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 100,
                thinkingConfig: { thinkingBudget: 0 } // Disable for low latency
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating observation with Gemini API:", error);
        return lang === 'pt' ? "O serviço de IA não está disponível no momento." : "AI service is currently unavailable.";
    }
};
