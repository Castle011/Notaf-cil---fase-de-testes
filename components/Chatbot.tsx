import React, { useState, useRef, useEffect } from 'react';
import { FunctionDeclaration, Type, Part } from "@google/genai";
import { useTranslations } from '../context/LanguageContext';
import { Invoice, InvoiceStatus, Message } from '../types';
import { callGeminiProxy } from '../lib/geminiClient';

interface ChatbotProps {
  invoices: Invoice[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (invoiceId: string) => Promise<void>;
}

const tools: { functionDeclarations: FunctionDeclaration[] }[] = [
  {
    functionDeclarations: [
      {
        name: 'createInvoice',
        description: 'Creates a new invoice. The issue date is always today.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            clientName: { type: Type.STRING, description: 'The name of the client.' },
            amount: { type: Type.NUMBER, description: 'The total amount of the invoice.' },
            dueDate: { type: Type.STRING, description: 'The due date for the invoice in YYYY-MM-DD format.' },
            observations: { type: Type.STRING, description: 'Optional notes or observations for the invoice.' },
          },
          required: ['clientName', 'amount', 'dueDate'],
        },
      },
      {
        name: 'getInvoiceDetails',
        description: "Retrieves the full details of a specific invoice using its ID.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'The ID of the invoice to retrieve, for example "d290f1ee-6c54-4b01-90e6-d701748f0851".' },
          },
          required: ['id'],
        },
      },
      {
        name: 'updateInvoice',
        description: 'Updates one or more fields of an existing invoice, identified by its ID.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'The ID of the invoice to update.' },
            clientName: { type: Type.STRING, description: 'The new name of the client.' },
            amount: { type: Type.NUMBER, description: 'The new total amount of the invoice.' },
            dueDate: { type: Type.STRING, description: 'The new due date in YYYY-MM-DD format.' },
            status: { type: Type.STRING, description: 'The new status of the invoice.', enum: Object.values(InvoiceStatus) },
            observations: { type: Type.STRING, description: 'The new notes or observations for the invoice.' },
          },
          required: ['id'],
        },
      },
      {
        name: 'deleteInvoice',
        description: 'Deletes an invoice permanently from the system using its ID.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'The ID of the invoice to delete.' },
          },
          required: ['id'],
        },
      },
    ],
  },
];

const Chatbot: React.FC<ChatbotProps> = ({ invoices, messages, setMessages, addInvoice, updateInvoice, deleteInvoice }) => {
  const { t } = useTranslations();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemInstruction = `You are a highly capable assistant for an invoice management app called NotaFácil.
Your primary purpose is to help users manage their invoices. You can create, update, delete, or provide details about invoices.
You can also chat about any other topic, but if the conversation strays too far from invoices, gently guide the user back to the app's purpose.
Use the provided tools to perform invoice actions when requested by the user.
For destructive actions like deleting an invoice, you MUST ask for user confirmation before calling the 'deleteInvoice' function.
The current date is ${new Date().toISOString().split('T')[0]}.
Always respond in the user's language, be it Portuguese, English, or any other.
When creating an invoice, the issue date is always today; you only need to ask for the due date.`;

  useEffect(() => {
    if (messages.length === 0) {
        setError(null);
        setMessages([{ role: 'model', text: t('chatbot.welcomeMessage') }]);
    }
  }, [messages.length, setMessages, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const executeFunctionCall = async (name: string, args: any): Promise<any> => {
    switch (name) {
      case 'createInvoice': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [year, month, day] = (args.dueDate as string).split('-').map(Number);
        const dueDateObj = new Date(year, month - 1, day);
        const newInvoiceData: Omit<Invoice, 'id'> = {
          clientName: args.clientName,
          amount: args.amount,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: args.dueDate,
          status: dueDateObj < today ? InvoiceStatus.Vencido : InvoiceStatus.Pendente,
          observations: args.observations || '',
        };
        await addInvoice(newInvoiceData);
        return { success: true, clientName: args.clientName, amount: args.amount };
      }
      case 'getInvoiceDetails': {
        const invoice = invoices.find(inv => inv.id.toLowerCase() === args.id.toLowerCase());
        return invoice ? { ...invoice } : { error: `Invoice with ID ${args.id} not found.` };
      }
      case 'updateInvoice': {
        const originalInvoice = invoices.find(inv => inv.id.toLowerCase() === args.id.toLowerCase());
        if (!originalInvoice) return { error: `Invoice with ID ${args.id} not found.` };
        const updatedInvoice = { ...originalInvoice, ...args };
        await updateInvoice(updatedInvoice);
        return { success: true, id: args.id };
      }
      case 'deleteInvoice': {
        const invoiceExists = invoices.some(inv => inv.id.toLowerCase() === args.id.toLowerCase());
        if (!invoiceExists) return { error: `Invoice with ID ${args.id} not found.` };
        await deleteInvoice(args.id);
        return { success: true, id: args.id };
      }
      default:
        return { error: `Unknown function: ${name}` };
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const textToSend = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
        const buildHistory = (currentMessages: Message[]): Part[] => {
            return currentMessages
                .filter(m => m.text !== t('chatbot.welcomeMessage'))
                .flatMap(msg => {
                    if (msg.role === 'user') {
                        return { role: 'user', parts: [{ text: msg.text }] };
                    }
                    if (msg.role === 'model' && msg.rawContent) {
                        return msg.rawContent;
                    }
                    if (msg.role === 'model') {
                        return { role: 'model', parts: [{ text: msg.text }] };
                    }
                    return [];
                });
        };

        let currentHistory = buildHistory(messages);
        let contents = [...currentHistory, { role: 'user', parts: [{ text: textToSend }] }];
        
        let response = await callGeminiProxy({
            model: 'gemini-2.5-flash',
            contents,
            config: { systemInstruction, tools }
        });

        while (response.functionCalls && response.functionCalls.length > 0) {
            const fc = response.functionCalls[0];
            
            // Display a message indicating tool use
            setMessages(prev => [...prev, { role: 'model', text: `Chamando ferramenta: \`${fc.name}\`...` }]);
            
            const result = await executeFunctionCall(fc.name, fc.args);
            
            contents = [
                ...contents,
                response.rawContent, // Model's turn asking for the function call
                { role: 'function', parts: [{ functionResponse: { name: fc.name, response: { result } } }] }
            ];

            response = await callGeminiProxy({
                model: 'gemini-2.5-flash',
                contents,
                config: { systemInstruction, tools }
            });
        }
        
        if (response.text) {
             const modelMessage: Message = { role: 'model', text: response.text, rawContent: response.rawContent };
             setMessages(prev => [...prev, modelMessage]);
        }

    } catch (err: any) {
        console.error("Chatbot error:", err);
        const errorMessage = err.message.includes('API key') ? t('chatbot.apiKeyMissing') : t('chatbot.errorMessage');
        setError(errorMessage);
        setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-700">
                    <div className="flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="px-4 text-sm text-red-500">{error}</p>}
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatbot.inputPlaceholder')}
            disabled={isLoading || !!error}
            className="flex-1 w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" disabled={isLoading || !input.trim() || !!error} className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 16.51l.906.259 1.956 5.585a1 1 0 001.788 0l7-14a1 1 0 00-1.169-1.409l-5 1.428A1 1 0 0011 3.49l-.906-.259L8.138 7.646a1 1 0 00-.545-.545L1.956 5.145a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 003 16.51l.906.259 1.956 5.585a1 1 0 001.788 0l7-14a1 1 0 00-1.169-1.409l-5 1.428A1 1 0 0011 3.49l-.906-.259L8.138 7.646a1 1 0 00-.545-.545L1.956 5.145z" transform="rotate(45 10 10)" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;