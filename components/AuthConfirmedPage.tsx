import React from "react";

export default function AuthConfirmedPage() {
  const goToSite = () => {
    window.location.href = "https://notaf-cil-fase-de-testes.vercel.app/";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800 text-center">
        <div className="flex justify-center mb-6">
             <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <svg className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
             </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Você foi autenticado!
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Agora você já pode acessar o NotaFácil.
        </p>

        <button
          onClick={goToSite}
          className="mt-8 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Ir para o site
        </button>
      </div>
    </div>
  );
}