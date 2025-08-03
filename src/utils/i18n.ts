/**
 * Initializes and configures the i18next internationalization instance for the application,
 * including loading translation resources and setting up language options.
 *
 * - Loads English and German translation files.
 * - Sets up the default language and fallback language to English.
 * - Integrates with React using `initReactI18next`.
 *
 * @module i18n
 */

/**
 * Returns the list of available language codes supported by the application.
 *
 * @returns {string[]} An array of supported language codes (e.g., ['en', 'de']).
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import translation files directly
import en from '../locales/en/translation.json';
import de from '../locales/de/translation.json';

export const getAvailableLanguages = (): string[] => ['en', 'de'];

const resources = {
  en: { translation: en },
  de: { translation: de },
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
