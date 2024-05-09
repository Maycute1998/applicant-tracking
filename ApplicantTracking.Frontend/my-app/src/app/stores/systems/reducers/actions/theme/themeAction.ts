import { ThemeState } from "../../../../../../data-type"


export type ThemeAction = {
    type: 'change_theme'
    payload: ThemeState
}