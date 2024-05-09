import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import { DropdownOptions } from '../../../data-type'

type DropdownListProp = {
  dataSource: DropdownOptions[]
  label?: React.ReactNode
  helperText?: React.ReactNode
  defaultValue?: unknown
  size?: 'small' | 'medium'
  textFieldProps?: TextFieldProps
}
const DropdownList = (props: DropdownListProp) => {
  const { dataSource, label, helperText, defaultValue, size, textFieldProps } = props
  return (
    <TextField select label={label} defaultValue={defaultValue} size={size} helperText={helperText} {...textFieldProps}>
      {dataSource.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DropdownList
