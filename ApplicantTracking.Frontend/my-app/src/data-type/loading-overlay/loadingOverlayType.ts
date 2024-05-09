import { LoadingOverlayAction } from '../../app/stores/systems/reducers/actions/loading-overlay/loadingOverlayAction'

export type LoadingOverlayContextType = {
  state: LoadingOverlayState
  dispatch: React.Dispatch<LoadingOverlayAction>
  onLoading: (isLoading: boolean) => void
}
export type LoadingOverlayState = {
  isLoading: boolean
}
