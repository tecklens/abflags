export const UserPlan = {
  free: 0,
  silver: 1,
  gold: 2,
  diamond: 3,
}

export const DOCS_URL = import.meta.env.VITE_DOCS_URL

export const DEFAULT_PAGE_SIZE = 10

export const TOP_NAV = [
  {
    title: 'Overview',
    href: 'https://github.com/tecklens/abflags/wiki',
    isActive: true,
    target: '_blank',
  },
  {
    title: 'Document',
    href: 'https://github.com/tecklens/abflags/wiki/Configuring-Abflags',
    isActive: false,
    target: '_blank',
  },
]
