import {Layout, LayoutBody, LayoutHeader} from "@client/components/custom/layout";
import {Search} from "@client/components/search";
import ThemeSwitch from "@client/components/theme-switch";
import {UserNav} from "@client/components/user-nav";
import {throttle} from 'lodash';
import {PaginationState} from '@tanstack/react-table';
import {useProject} from '@client/lib/store/projectStore';
import {useAuth} from '@client/context/auth';
import {useEffect, useRef} from 'react';
import {columns, DataTable} from '@client/pages/variable/components';
import {NumberParam, StringParam, useQueryParams, withDefault} from 'use-query-params';
import {DEFAULT_PAGE_SIZE, TOP_NAV} from '@client/constant';
import {TopNav} from "@client/components/top-nav";

export default function VariablePage() {
  const {token} = useAuth()
  const {variables, fetchVariables} = useProject()
  const [query, setQuery] = useQueryParams({
    p: withDefault(NumberParam, 0),
    l: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    v: NumberParam,
  });

  useEffect(() => {
    fetchVariables({
      page: query.p,
      limit: query.l,
    })
  }, [token, query]);

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

      <LayoutBody className="flex flex-col gap-3 items-center" fixedHeight>
        <div className={'max-w-screen-lg w-full'}>
          <DataTable
            data={variables.data}
            columns={columns}
            totalCount={variables.total ?? 0}
            page={{
              pageIndex: query.p,
              pageSize: query.l
            }}
            onPageChange={throttle((p: PaginationState) => {
              setQuery({
                p: p.pageIndex,
                l: p.pageSize,
              })
            }, 300)}
          />
        </div>
      </LayoutBody>
    </Layout>
  )
}
