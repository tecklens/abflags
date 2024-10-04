import { Layout, LayoutBody, LayoutHeader } from "@client/components/custom/layout";
import { Search } from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import { UserNav } from "@client/components/user-nav";

export default function VariablePage() {
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

            </LayoutBody>
        </Layout>
    )
}