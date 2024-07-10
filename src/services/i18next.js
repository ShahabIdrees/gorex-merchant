import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from '../locale/english.json';
import arabic from '../locale/arabic.json';

const languageResources = {
  en: {translation: english},
  ar: {translation: arabic},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  // lng: 'ar',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;
