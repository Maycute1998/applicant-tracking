import { useContext } from 'react'
import { ThemeContext } from '../../../../../data-type/system/themes/themeType'
import { CustomThemeContext } from '../../contexts/custom-theme-context/customThemeContext'

const useCustomTheme = () => {
  const { state, dispatch, onToggleTheme } = useContext(CustomThemeContext) as ThemeContext
  return {
    state,
    dispatch,
    onToggleTheme,
  }
}
export { useCustomTheme }
