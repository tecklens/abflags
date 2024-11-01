import React, {useState} from 'react'
import {IconChevronsLeft, IconMenu2, IconX} from '@tabler/icons-react'
import {Layout, LayoutHeader} from './custom/layout'
import {Button} from './custom/button'
import Nav from './nav'
import {cn} from '@client/lib/utils'
import {sidelinks} from '@client/data/sidelinks'
import SidebarTour from '@client/components/sidebar-tour'
import SelectProject from "@client/pages/projects/components/select-project";
import logo from '@client/assets/logoab.png'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar2({
                                   className,
                                   isCollapsed,
                                   setIsCollapsed,
                                 }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 shadow md:px-4">
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <img src={logo} alt={'logo'} width={36} height={36}/>
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className="font-medium">AbFlags</span>
              <span className="text-xs">Featured Flags & A/B Testing</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </LayoutHeader>
        {/* Navigation links */}
        <Nav
          open={navOpened}
          id="sidebar-menu"
          className={`h-full flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
      <SidebarTour onOpenCollapse={() => setIsCollapsed(false)}/>
      <SelectProject />
    </aside>
  )
}
