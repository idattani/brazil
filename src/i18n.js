import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// not like to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

import translationEng from "./locales/en/translation.json";
import translationPtBR from "./locales/pt-BR/translation.json";

i18n
  // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    // lng: 'en',
    resources: {
      en: {
        translations: translationEng
      },
      "en-GB": {
        translations: translationEng
      },
      "pt-BR": {
        translations: translationPtBR
      },
    },

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
  
    // keySeparator: false, // we use content as keys
  
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ","
    },
  
    react: {
      wait: true,
      useSuspense: false
    }
  });


export default i18n;