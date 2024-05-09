import { createContext } from 'react'
import { ThemeContext } from '../../../../../data-type/system/themes/themeType'
import { InitThemeState } from '../../state-init/stateInit'

const CustomThemeContext = createContext<ThemeContext | null>({
  state: InitThemeState,
  dispatch: () => {},
  onToggleTheme: () => {},
})
export { CustomThemeContext }
