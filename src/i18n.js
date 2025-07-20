import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      headerTitle: "Gas Prices Dashboard",
      toggleLanguage: "Français",
      lineChartTitle: "Gas Prices Over Time in canada",
      dateRangeLabel: "Date Range (e.g. 2023-01 to 2024-12):",
      selectProvinces: "Select Provinces",
      choroplethTitle: "Choropleth Map – Prices for",
      selectMonth: "Select Month:",
      noData: "No data",
    },
  },
  fr: {
    translation: {
      headerTitle: "Tableau de bord des prix de l’essence",
      toggleLanguage: "English",
      lineChartTitle: "Prix de l’essence au fil du temps au canada",
      dateRangeLabel: "Plage de dates (ex. 2023-01 à 2024-12):",
      selectProvinces: "Sélectionner les provinces",
      choroplethTitle: "Carte des prix –",
      selectMonth: "Sélectionnez le mois :",
      noData: "Pas de données",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
