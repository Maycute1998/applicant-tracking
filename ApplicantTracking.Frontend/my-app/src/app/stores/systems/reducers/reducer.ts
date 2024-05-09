import { AuthState, LoadingOverlayState, ThemeState } from '../../../../data-type'
import { AuthAction } from './actions/auth/authAction'
import { LoadingOverlayAction } from './actions/loading-overlay/loadingOverlayAction'
import { ThemeAction } from './actions/theme/themeAction'

const themeReducer = (state: ThemeState, action: ThemeAction) => {
  switch (action.type) {
    case 'change_theme':
      return {
        ...state,
        mode: action.payload.mode,
      }
    default:
      return state
  }
}

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      }
    case 'logout':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      }
    default:
      return state
  }
}

const loadingOverlayReducer = (state: LoadingOverlayState, action: LoadingOverlayAction) => {
  switch (action.type) {
    case 'active_loading':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      }
    default:
      return state
  }
}
export { authReducer, loadingOverlayReducer, themeReducer }
