import React from 'react'

export type MenuProps = {
  id: string | undefined
  title: string | undefined
  path?: string | undefined
}
export type ExternalMenuProps = {
  id: string | undefined
  title: string | undefined
  path?: string | undefined
  component?: React.ReactElement | React.ReactNode
}
