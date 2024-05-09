import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'
import { CustomThemeContext, InitThemeState, themeReducer } from '../..'
import { LocalStorageConfig } from '../../../../../constant'
import { ThemeState } from '../../../../../data-type'

const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, InitThemeState)
  const themeValueFormLocalStorage: string | null = localStorage.getItem(LocalStorageConfig.themeKey)

  const getTheme = useCallback(() => {
    if (themeValueFormLocalStorage === 'light') {
      dispatch({
        type: 'change_theme',
        payload: {
          mode: 'light',
        },
      })
    } else {
      dispatch({
        type: 'change_theme',
        payload: {
          mode: 'dark',
        },
      })
    }
  }, [])

  const themeCustom = useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.mode,
        },
      }),
    [state.mode]
  )

  const onToggleTheme = () => {
    const newPayload: ThemeState = {
      mode: state.mode === 'light' ? 'dark' : 'light',
    }
    dispatch({
      type: 'change_theme',
      payload: {
        mode: newPayload.mode,
      },
    })
    localStorage.setItem(LocalStorageConfig.themeKey, newPayload.mode)
  }

  useEffect(() => {
    getTheme()
  }, [])

  return (
    <CustomThemeContext.Provider value={{ state, dispatch, onToggleTheme }}>
      <ThemeProvider theme={themeCustom}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
export { CustomThemeProvider }
