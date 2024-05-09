import PropTypes from 'prop-types'
import { useCallback, useReducer } from 'react'
import { LoadingOverlayContext, loadingOverlayReducer } from '../..'
import { InitLoadingOverlayState } from '../../state-init/stateInit'

const LoadingOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingOverlayReducer, InitLoadingOverlayState)

  const onLoading = useCallback((isLoading: boolean) => {
    dispatch({
      type: 'active_loading',
      payload: {
        isLoading,
      },
    })
  }, [])

  return <LoadingOverlayContext.Provider value={{ state, dispatch, onLoading }}>{children}</LoadingOverlayContext.Provider>
}

LoadingOverlayProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { LoadingOverlayProvider }
