import React from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-2 bg-primary text-white">
      <h1 className="h5 mb-0">{t('headerTitle')}</h1>
      <button onClick={toggleLang} className="btn btn-light">
        {t('toggleLanguage')}
      </button>
    </header>
  );
};

export default Header;
