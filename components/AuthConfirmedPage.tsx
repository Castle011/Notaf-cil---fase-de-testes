import React from "react";
import { useTranslations } from '../context/LanguageContext';

export default function AuthConfirmedPage() {
  const { t } = useTranslations();

  const goToSite = () => {
    window.location.href = "https://notaf-cil-fase-de-testes.vercel.app";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t('authConfirm.title')}
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          {t('authConfirm.subtitle')}
        </p>

        <button
          onClick={goToSite}
          className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition"
        >
          {t('authConfirm.button')}
        </button>
      </div>
    </div>
  );
}