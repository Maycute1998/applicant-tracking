import { AuthState, LoadingOverlayState, ThemeState } from "../../../../data-type";

const InitAuthState: AuthState = {
    isAuthenticated: false
}

const InitThemeState: ThemeState = {
    mode: 'dark'
}

const InitLoadingOverlayState: LoadingOverlayState = {
    isLoading: false
}
export { InitAuthState, InitLoadingOverlayState, InitThemeState };

