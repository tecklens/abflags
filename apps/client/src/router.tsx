import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import { ProtectedRoute } from '@client/components/protect-route'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      // Main routes
      {
        path: '/',
        lazy: async () => {
          const AppShell = await import('./components/app-shell')
          return { Component: AppShell.default }
        },
        errorElement: <GeneralError />,
        children: [
          {
            path: 'get-started',
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/get-started')).default,
            }),
          },
          {
            path: 'contribute/bug-report',
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/contribute/bug-report')).default,
            }),
          },
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/projects')).default,
            }),
          },
          {
            path: 'project/create',
            lazy: async () => ({
              Component: (await import('@client/pages/projects/create')).default,
            }),
          },
          {
            path: 'variable',
            lazy: async () => ({
              Component: (await import('@client/pages/variable')).default,
            }),
          },
          {
            path: 'feature/:id',
            lazy: async () => ({
              Component: (await import('@client/pages/feature')).default,
            }),
          },
          {
            path: 'members',
            lazy: async () => ({
              Component: (await import('@client/pages/members')).default,
            }),
          },
          {
            path: 'analysis',
            lazy: async () => ({
              Component: (await import('@client/components/coming-soon')).default,
            }),
          },
          {
            path: 'overview',
            lazy: async () => ({
              Component: (await import('@client/pages/overview')).default,
            }),
          },
          {
            path: 'settings',
            lazy: async () => ({
              Component: (await import('./pages/settings')).default,
            }),
            errorElement: <GeneralError />,
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('./pages/settings/profile')).default,
                }),
              },
              {
                path: 'account',
                lazy: async () => ({
                  Component: (await import('./pages/settings/account')).default,
                }),
              },
              {
                path: 'appearance',
                lazy: async () => ({
                  Component: (await import('./pages/settings/appearance')).default,
                }),
              },
              {
                path: 'password',
                lazy: async () => ({
                  Component: (await import('./pages/settings/password')).default,
                }),
              },
              {
                path: 'password-reset/:txId',
                lazy: async () => ({
                  Component: (await import('./pages/settings/password/change-password-step-2')).default,
                }),
              },
              {
                path: 'notifications',
                lazy: async () => ({
                  Component: (await import('./pages/settings/notifications'))
                    .default,
                }),
              },
              {
                path: 'display',
                lazy: async () => ({
                  Component: (await import('./pages/settings/display')).default,
                }),
              },
              {
                path: 'billing',
                lazy: async () => ({
                  Component: (await import('./pages/settings/billing'))
                    .default,
                }),
                errorElement: <GeneralError className='h-[50svh]' minimal />,
              },
              {
                path: 'keys',
                lazy: async () => ({
                  Component: (await import('./pages/settings/access-keys'))
                    .default,
                }),
                errorElement: <GeneralError className='h-[50svh]' minimal />,
              },
            ],
          },
        ],
      },
    ]
  },
  // Auth routes
  {
    path: '/payment-success',
    lazy: async () => ({
      Component: (await import('./pages/settings/billing/tier/payment-success')).default,
    }),
  },
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/auth/invitation/:id',
    lazy: async () => ({
      Component: (await import('./pages/auth/invitation')).default,
    }),
  },
  // {
  //   path: '/sign-in-2',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in-2')).default,
  //   }),
  // },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
