import { Layout, LayoutBody, LayoutHeader } from "@client/components/custom/layout";
import { Search } from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import { UserNav } from "@client/components/user-nav";
import ProjectInfo from "@client/pages/projects/components/project-info";
import Features from "./features";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@client/components/ui/tabs";
import ComingSoon from "@client/components/coming-soon";

export default function Projects() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col gap-3" fixedHeight>
        <ProjectInfo />
        <Tabs defaultValue="overview">
          <TabsList className="env-switcher grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="setting">Settings</TabsTrigger>
            <TabsTrigger value="event_log">Event log</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Features />
          </TabsContent>
          <TabsContent value="health">
            <ComingSoon className="h-auto py-16" />
          </TabsContent>
          <TabsContent value="setting">
            <ComingSoon className="h-auto py-16" />
          </TabsContent>
          <TabsContent value="event_log">
            <ComingSoon className="h-auto py-16" />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
