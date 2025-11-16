import { getAiClient } from '../lib/geminiClient';

const prompts = {
    pt: (clientName: string, amount: number, service: string) => `Gere uma breve observação profissional para uma nota fiscal em português. Cliente: "${clientName}", Valor: R$ ${amount.toFixed(2)}, Serviço: "${service}". A observação deve ser concisa e formal.`,
    en: (clientName: string, amount: number, service: string) => `Generate a brief, professional observation for an invoice in English. Client: "${clientName}", Amount: $${amount.toFixed(2)}, Service: "${service}". The observation should be concise and formal.`
};

export const generateInvoiceObservation = async (clientName: string, amount: number, service: string, lang: 'pt' | 'en'): Promise<string> => {
    const ai = getAiClient();
    // Check if the AI client was initialized before using it
    if (!ai) {
        return lang === 'pt' ? "Serviço de IA indisponível. Por favor, configure a chave de API." : "AI Service unavailable. Please configure the API key.";
    }

    const prompt = prompts[lang](clientName, amount, service);

    try {
        // FIX: Simplified the `contents` parameter for a single text prompt.
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
        // Handle specific API key error by reloading the page to trigger re-selection.
        if (error instanceof Error && error.message.includes('Requested entity was not found.')) {
            alert("Sua chave de API parece ser inválida. A página será recarregada para que você possa selecionar uma nova chave.");
            window.location.reload();
        }
        console.error("Error generating observation with Gemini API:", error);
        return lang === 'pt' ? "Erro ao gerar observação. Tente novamente." : "Error generating observation. Please try again.";
    }
};
