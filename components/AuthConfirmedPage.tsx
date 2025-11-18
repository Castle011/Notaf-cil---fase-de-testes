import React from "react";

export default function AuthConfirmedPage() {
  const goToSite = () => {
    window.location.href = "https://notaf-cil-fase-de-testes.vercel.app";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800 text-center">
        <div className="flex justify-center mb-2">
             <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
             </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Você foi autenticado!
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Seu e-mail foi confirmado com sucesso. Agora você já pode acessar o NotaFácil.
        </p>

        <button
          onClick={goToSite}
          className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Ir para o site
        </button>
      </div>
    </div>
  );
}