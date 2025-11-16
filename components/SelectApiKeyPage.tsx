import React from 'react';
import { useTranslations } from '../context/LanguageContext';

const SelectApiKeyPage: React.FC<{ onSelectKey: () => void }> = ({ onSelectKey }) => {
  const { t } = useTranslations();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800 text-center">
        <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('apiKey.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('apiKey.body')}
        </p>
        <button
          onClick={onSelectKey}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
        >
          {t('apiKey.button')}
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">
            {t('apiKey.billingLink')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default SelectApiKeyPage;