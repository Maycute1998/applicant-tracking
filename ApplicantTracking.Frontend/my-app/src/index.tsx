import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes'
import { AuthProvider, CustomThemeProvider, LoadingOverlayProvider } from './app/stores/systems'
import i18n from './locales/i18n'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <CustomThemeProvider>
    <AuthProvider>
      <LoadingOverlayProvider>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </LoadingOverlayProvider>
    </AuthProvider>
  </CustomThemeProvider>
)
