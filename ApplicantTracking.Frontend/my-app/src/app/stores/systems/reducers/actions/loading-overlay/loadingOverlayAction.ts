import { LoadingOverlayState } from '../../../../../../data-type'

export type LoadingOverlayAction = {
  type: 'active_loading'
  payload: LoadingOverlayState
}
