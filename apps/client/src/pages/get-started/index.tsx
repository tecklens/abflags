import { Layout, LayoutBody, LayoutHeader } from '@client/components/custom/layout'
import { TopNav } from '@client/components/top-nav'
import { Search } from '@client/components/search'
import ThemeSwitch from '@client/components/theme-switch'
import { UserNav } from '@client/components/user-nav'
import { useTheme } from '@client/components/theme-provider'
import { useState } from 'react'
import FlagsGetStarted from '@client/pages/get-started/components/FlagsGetStarted'
import { AnimatePresence } from 'framer-motion'
import EnvironmentGetStarted from '@client/pages/get-started/components/EnvironmentGetStarted'
import UseSdkGetStarted from '@client/pages/get-started/components/UseSdkGetStarted'
import ProjectGetStarted from "@client/pages/get-started/components/ProjectGetStarted";

const tabs = [
  {
    title: 'Create Project',
    key: 'project',
  },
  {
    title: 'Create Future Flags',
    key: 'flags',
  },
  {
    title: 'API Key',
    key: 'api-key',
  },
  {
    title: 'Use SDK',
    key: 'sdk',
  },
]
export default function GetStarted() {
  const { theme } = useTheme()
  const [tab, setTab] = useState('provider')

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={[]} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Get Started
          </h1>
        </div>
        <div className={'flex space-x-3 lg:space-x-6 w-full'}>
          <div className={'flex flex-col space-y-2 gap-4 w-[200px] font-semibold my-6'}>
            {tabs.map(e => (
              <div
                key={e.key}
                className={`${tab === e.key
                  ? theme === 'light'
                    ? 'bg-green-100'
                    : 'bg-slate-900'
                  : 'hover:bg-slate-100 hover:dark:bg-slate-800'} px-5 py-2 rounded-lg cursor-pointer`}
                onClick={() => setTab(e.key)}
              >
                {e.title}
              </div>
            ))}
          </div>
          <div className={'flex-1 py-8'}>
            <AnimatePresence>
              {tab === 'project'
                ? <ProjectGetStarted />
                : tab === 'flags'
                  ? <FlagsGetStarted key={'flags'} />
                  : tab === 'api-key'
                    ? <EnvironmentGetStarted />
                    : tab === 'sdk'
                      ? <UseSdkGetStarted />
                      : null}
            </AnimatePresence>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  )
}
