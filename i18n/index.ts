import * as i18nextNamespace from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

i18nextNamespace.default.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
    ar: {
      translation: ar,
    },
  },
});

export default i18nextNamespace.default;
