import { ThemeAction } from '../../../app/stores/systems/reducers/actions/theme/themeAction'

export type ThemeContext = {
  state: ThemeState
  dispatch: React.Dispatch<ThemeAction>
  onToggleTheme: () => void
}

export type ThemeState = {
  mode: 'light' | 'dark'
}
