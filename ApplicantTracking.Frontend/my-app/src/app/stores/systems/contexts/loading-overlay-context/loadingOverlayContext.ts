import { createContext } from 'react'
import { LoadingOverlayContextType } from '../../../../../data-type/loading-overlay/loadingOverlayType'
import { InitLoadingOverlayState } from '../../state-init/stateInit'

const LoadingOverlayContext = createContext<LoadingOverlayContextType | null>({
  state: InitLoadingOverlayState,
  dispatch: () => {},
  onLoading: () => {},
})
export { LoadingOverlayContext }
