import { useContext } from 'react'
import { LoadingOverlayContextType } from '../../../../../data-type/loading-overlay/loadingOverlayType'
import { LoadingOverlayContext } from '../../contexts/loading-overlay-context/loadingOverlayContext'

const useLoadingOverlay = () => {
  const { state, dispatch, onLoading } = useContext(LoadingOverlayContext) as LoadingOverlayContextType
  return {
    state,
    dispatch,
    onLoading,
  }
}
export { useLoadingOverlay }
