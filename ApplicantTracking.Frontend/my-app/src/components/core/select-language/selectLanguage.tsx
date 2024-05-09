import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import { LanguageOptions } from '../../../data-type'

type SelectLanguageProp = {
  dataSource: LanguageOptions[]
  label?: React.ReactNode
  helperText?: React.ReactNode
  defaultValue?: unknown
  size?: 'small' | 'medium'
  textFieldProps?: TextFieldProps
}
const SelectLanguage = (props: SelectLanguageProp) => {
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

export default SelectLanguage
