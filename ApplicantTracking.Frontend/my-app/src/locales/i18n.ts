import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LocalStorageConfig } from '../constant'
import en from './en'
import vi from './vi'
const defaultLocale = 'vi'
export const resources = {
  en,
  vi,
}
void i18n.use(initReactI18next).init(
  {
    resources,
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  },
  (error, t) => {
    console.groupCollapsed('i18next: setup language')
    console.log('Set Local Storage')
    if (!error) {
      if (!localStorage.getItem(LocalStorageConfig.languageKey)) {
        localStorage.setItem(LocalStorageConfig.languageKey, defaultLocale)
        console.log('Set default language')
      } else {
        console.log('Language already set :', localStorage.getItem(LocalStorageConfig.languageKey))
        const value: string | null = localStorage.getItem(LocalStorageConfig.languageKey)
        i18n.changeLanguage(value ?? defaultLocale)
        console.log('i18next: setup language successfully : ', value)
      }
    } else {
      console.log('i18next: setup language error :', t, error)
    }
    console.groupEnd()
  }
)
export default i18n
