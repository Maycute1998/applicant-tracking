import { useMemo } from 'react'
import { LanguageOptions } from '../../data-type'
import { useTranslation } from 'react-i18next'

const useLanguage = () => {
  const { t } = useTranslation()
  const getLanguages = () =>
    useMemo(() => {
      {
        const langOptions: LanguageOptions[] = []
        langOptions.push(
          {
            value: 'vi-VN',
            label: t('common:languages.vi'),
          },
          {
            value: 'en-US',
            label: t('common:languages.en'),
          }
        )
        return langOptions
      }
    }, [])
  return getLanguages()
}
export default useLanguage
