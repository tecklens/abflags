import { Layout, LayoutBody, LayoutHeader } from "@client/components/custom/layout";
import { Search } from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import { UserNav } from "@client/components/user-nav";
import { throttle } from 'lodash';
import { PaginationState } from '@tanstack/react-table';
import { useProject } from '@client/lib/store/projectStore';
import { useAuth } from '@client/context/auth';
import { useEffect, useRef } from 'react';
import { columns, DataTable } from '@client/pages/variable/components';

export default function VariablePage() {
  const {token} = useAuth()
  const { variables, fetchVariables } = useProject()
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    fetchVariables({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
    })
  }, [token, page.current]);

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

            <LayoutBody className="flex flex-col gap-3 items-center" fixedHeight>
              <div className={'max-w-screen-lg w-full'}>
                <DataTable
                  data={variables.data}
                  columns={columns}
                  totalCount={variables.total ?? 0}
                  page={page.current}
                  onPageChange={throttle((p: PaginationState) => {
                    page.current = {
                      pageSize: p.pageSize,
                      pageIndex: p.pageIndex,
                    }
                  }, 300)}
                />
              </div>
            </LayoutBody>
        </Layout>
    )
}
