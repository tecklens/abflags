import { Outlet } from 'react-router-dom'
import {
  IconExclamationCircle,
  IconKey, IconLockAccess,
  IconNotification,
  IconPalette,
  IconPassword,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Search } from '@client/components/search'
import { Separator } from '@client/components/ui/separator'
import ThemeSwitch from '@client/components/theme-switch'
import { UserNav } from '@client/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@client/components/custom/layout'
import SidebarNav from './components/sidebar-nav'
import React from 'react'
import { useTheme } from '@client/components/theme-provider'

export default function Settings() {
  const {theme} = useTheme()
  return (
    <Layout fadedBelow fixedHeight>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='sticky top-0 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='w-full p-1 pr-4 lg:max-w-xl'>
            <div className='pb-16 w-full'>
              <Outlet />
            </div>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Change Password',
    icon: <IconLockAccess size={18} />,
    href: '/settings/password',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  // {
  //   title: 'Display',
  //   icon: <IconBrowserCheck size={18} />,
  //   href: '/settings/display',
  // },
  {
    title: 'Billing',
    icon: <IconExclamationCircle size={18} />,
    href: '/settings/billing',
  },
  {
    title: 'Personal access keys',
    icon: <IconKey size={18} />,
    href: '/settings/keys',
  },
]
