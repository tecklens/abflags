import {Card, CardContent, CardHeader} from "@client/components/ui/card";
import {IFeature} from "@abflags/shared";
import Empty from "@client/components/custom/empty";

export default function FeatureSetting({feature}: { feature: IFeature }) {

  if (!feature) return <Empty />
  return (
    <Card>
      <CardHeader className={'font-bold text-xl'}>Settings</CardHeader>
      <CardContent className={'flex flex-col gap-3'}>
        <div className={'font-semibold text-xl'}>Feature information</div>
        <div className={'inline-flex gap-1'}>
          <span className={'font-semibold'}>Name:</span>
          <span>{feature.name}</span>
        </div>
        <div className={'inline-flex gap-1'}>
          <span className={'font-semibold'}>Description:</span>
          <span>{feature.description}</span>
        </div>
        <div className={'inline-flex gap-1'}>
          <span className={'font-semibold'}>Type:</span>
          <span>{feature.type}</span>
        </div>
      </CardContent>
    </Card>
  )
}
