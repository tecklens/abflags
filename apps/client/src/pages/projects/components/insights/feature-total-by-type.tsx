import {RepositoryFactory} from "@client/api/repository-factory";
import {useEffect, useState} from "react";
import {useAuth} from "@client/context/auth";
import {AxiosResponse, HttpStatusCode} from "axios";
import {FEATURE_TYPES} from "@client/pages/feature/components/feature-types";
import {Button} from "@client/components/custom/button";
import {get} from "lodash";

const FeatureRepository = RepositoryFactory.get('feature')
export default function FeatureTotalByType() {
  const {token} = useAuth()
  const [data, setData] = useState({})
  const fetchData = () => {
    FeatureRepository.totalByType()
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          setData(resp.data)
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [token])

  return (
    <div className={'flex flex-col gap-3'}>
      {FEATURE_TYPES.map(e => (
        <Button variant={'ghost'} key={e.id} className={'w-full flex gap-2'}>
          {e.icon}
          <span className={'flex-1 text-start'}>{e.label}</span>
          <span>{get(data, e.id) ?? 0}</span>
        </Button>
      ))}
    </div>
  )
}
