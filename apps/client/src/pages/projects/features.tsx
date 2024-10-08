import {Button} from "@client/components/custom/button";
import {useAuth} from "@client/context/auth";
import {useFeature} from "@client/lib/store/featureStore";
import NewFeature from "@client/pages/projects/components/new-feature";
import {PaginationState} from "@tanstack/react-table";
import {throttle} from "lodash";
import {useEffect, useRef} from "react";
import {columns, DataTable} from "./components";

export default function Features() {
  const {token} = useAuth()
  const {features, fetchFeature, setOpenNewFeature} = useFeature()
  const page = useRef<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchData = throttle((payload?: any) => {
    fetchFeature({
      page: page.current.pageIndex,
      limit: page.current.pageSize,
      ...(payload ?? {}),
    })
  }, 200, {leading: true})

  useEffect(() => {
    if (token) {
      fetchData()

      const intervalId = setInterval(fetchData, 10000)

      return () => intervalId && clearInterval(intervalId)
    }
  }, [token])
  return (
    <>
      <div className={'p-3 shadow-lg dark:border rounded-lg'}>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Feature flags ({features.total})</h2>
          </div>
          <div className={'flex gap-2 items-center'}>
            <Button onClick={() => setOpenNewFeature(true)}>New feature flag</Button>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <DataTable
            data={features.data}
            columns={columns}
            totalCount={features.total ?? 0}
            page={page.current}
            onFilter={(filter: any) => {
              fetchData(filter)
            }}
            onPageChange={throttle((p: PaginationState) => {
              page.current = {
                pageSize: p.pageSize,
                pageIndex: p.pageIndex,
              }
              fetchData()
            }, 300)}
          />
        </div>
      </div>
      <NewFeature/>
    </>
  )
}
