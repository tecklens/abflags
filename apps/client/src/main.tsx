import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {Toaster} from '@client/components/ui/toaster'
import {ThemeProvider} from '@client/components/theme-provider'
import router from '@client/router'
import '@client/index.css'
import {TooltipProvider} from '@client/components/ui/tooltip'
import AuthProvider from '@client/context/auth'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <TooltipProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </TooltipProvider>
    <Toaster/>
  </ThemeProvider>,
)
