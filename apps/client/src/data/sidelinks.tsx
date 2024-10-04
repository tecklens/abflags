import {
  IconBrandMantine,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconHierarchy2,
  IconLayoutDashboard,
  IconRouteAltLeft,
  IconSettings,
  IconTruck,
  IconUsers,
  IconUsersGroup,
  IconVariable,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href?: string
  icon: any
  variant?: any
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Variables',
    label: '',
    href: '/variable',
    icon: <IconVariable size={18} />,
  },
  {
    title: 'Members',
    label: '',
    href: '/members',
    icon: <IconUsersGroup size={18} />,
  },
  {
    title: 'Analysis',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
