import {useProject} from "@client/lib/store/projectStore";
import {useAuth} from "@client/context/auth";
import {useEffect} from "react";
import {
  IconInfoCircle,
  IconRadiusBottomRight,
  IconRadiusTopRight,
  IconTrendingDown,
  IconTrendingUp
} from "@tabler/icons-react";

export default function ProjectInsights() {
  const {token} = useAuth()
  const {insights, fetchInsights} = useProject();

  console.log(insights)

  useEffect(() => {
    fetchInsights()
  }, [token])

  const diffTotalChange = (insights?.stats.projectChangesCurrentWindow ?? 0) - (insights?.stats.projectChangesPastWindow ?? 0)
  const diffFeatures = (insights?.stats.featuresCreatedCurrentWindow ?? 0) - (insights?.stats.featuresCreatedPastWindow ?? 0)
  const diffFeaturesArchived = (insights?.stats.featuresArchivedCurrentWindow ?? 0) - (insights?.stats.featuresArchivedPastWindow ?? 0)

  return (
    <div className={'flex flex-col gap-3'}>
      <div className={'grid grid-cols-2 gap-3'}>
        {/* total changes*/}
        <div className={'flex flex-col gap-2 rounded-lg shadow-lg p-3 dark:border'}>
          <div className={'font-semibold inline-flex items-center gap-1'}>Total changes <IconInfoCircle size={15}/></div>
          <div className={'flex gap-5 items-end'}>
            <div className={'font-semibold text-4xl'}>
              {insights?.stats.projectChangesCurrentWindow}
            </div>
            <div className={'flex flex-col'}>
              <div className={'inline-flex items-center gap-2 text-green-700'}>
                  {diffTotalChange < 0
                  ? <IconTrendingDown />
                  : <IconTrendingUp />}
                <span className={'text-lg font-semibold'}>{diffTotalChange}</span>
              </div>
              <span className={'text-gray-500'}>this month</span>
            </div>
          </div>
        </div>
        {/*  avg time to project*/}
        <div className={'flex flex-col gap-2 rounded-lg shadow-lg p-3 dark:border'}>
          <div className={'font-semibold inline-flex items-center gap-1'}>Avg. time to production <IconInfoCircle size={15}/></div>
          <div className={'flex gap-5 items-end'}>
            <div className={'font-semibold text-lg'}>
              Coming soon
            </div>
            {/*<div className={'flex flex-col'}>*/}
            {/*  <div className={'inline-flex items-center gap-2 text-green-700'}>*/}
            {/*    {diffTotalChange < 0*/}
            {/*      ? <IconTrendingDown />*/}
            {/*      : <IconTrendingUp />}*/}
            {/*    <span className={'text-lg font-semibold'}>{diffTotalChange}</span>*/}
            {/*  </div>*/}
            {/*  <span className={'text-gray-500'}>this month</span>*/}
            {/*</div>*/}
          </div>
        </div>
        {/*  featured created */}
        <div className={'flex flex-col gap-2 rounded-lg shadow-lg p-3 dark:border'}>
          <div className={'font-semibold inline-flex items-center gap-1'}>Features created <IconInfoCircle size={15}/></div>
          <div className={'flex gap-5 items-end'}>
            <div className={'font-semibold text-4xl'}>
              {insights?.stats.featuresCreatedCurrentWindow}
            </div>
            <div className={'flex flex-col'}>
              <div className={'inline-flex items-center gap-2 text-green-700'}>
                {diffFeatures < 0
                  ? <IconTrendingDown />
                  : <IconTrendingUp />}
                <span className={'text-lg font-semibold'}>{diffFeatures}</span>
              </div>
              <span className={'text-gray-500'}>this month</span>
            </div>
          </div>
        </div>
        {/* Features archived*/}
        <div className={'flex flex-col gap-2 rounded-lg shadow-lg p-3 dark:border'}>
          <div className={'font-semibold inline-flex items-center gap-1'}>Features archived <IconInfoCircle size={15}/></div>
          <div className={'flex gap-5 items-end'}>
            <div className={'font-semibold text-4xl'}>
              {insights?.stats.featuresArchivedCurrentWindow}
            </div>
            <div className={'flex flex-col'}>
              <div className={'inline-flex items-center gap-2 text-green-700'}>
                {diffFeaturesArchived < 0
                  ? <IconTrendingDown />
                  : <IconTrendingUp />}
                <span className={'text-lg font-semibold'}>{diffFeaturesArchived}</span>
              </div>
              <span className={'text-gray-500'}>this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
