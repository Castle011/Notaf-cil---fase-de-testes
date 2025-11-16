import React from 'react';
import { useTranslations } from '../context/LanguageContext';

const EmailConfirmedPage: React.FC = () => {
  const { t } = useTranslations();
  return (
    <div className="bg-slate-900 font-sans flex flex-col justify-center items-center h-screen m-0">
        <div className="bg-slate-800 px-12 py-8 rounded-2xl text-center shadow-xl max-w-md w-full mx-4">
            <div className="text-5xl text-green-500 mb-4" aria-hidden="true">✅</div>
            <h1 className="text-2xl mb-2 text-slate-100 font-bold">{t('emailConfirm.title')}</h1>
            <p className="text-slate-300 mb-8">{t('emailConfirm.subtitle')}</p>
            <a 
                href="/"
                className="bg-indigo-500 border-none text-white py-3 px-6 rounded-lg cursor-pointer text-base font-medium transition-colors hover:bg-indigo-600"
            >
                {t('emailConfirm.button')}
            </a>
        </div>
    </div>
  );
};

export default EmailConfirmedPage;
