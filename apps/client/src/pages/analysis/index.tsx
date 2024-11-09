import {Layout, LayoutBody, LayoutHeader} from "@client/components/custom/layout";
import {TopNav} from "@client/components/top-nav";
import {Search} from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import {UserNav} from "@client/components/user-nav";
import UserInsight from "@client/pages/analysis/components/user-insight";
import ApiInsights from "@client/pages/analysis/components/api-insights";
import {TOP_NAV} from "@client/constant";

export default function AnalysisPage() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={TOP_NAV}/>
        <div className="ml-auto flex items-center space-x-4">
          <Search/>
          <ThemeSwitch/>
          <UserNav/>
        </div>
      </LayoutHeader>

      <LayoutBody className="space-y-4">
        <UserInsight />
        <ApiInsights />
      </LayoutBody>
    </Layout>
  )
}
