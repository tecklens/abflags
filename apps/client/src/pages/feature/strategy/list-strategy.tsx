import {useParams} from "react-router-dom";
import {useFeature} from "@client/lib/store/featureStore";
import React, {useCallback, useEffect} from "react";
import {useAuth} from "@client/context/auth";
import StrategyCard from "./strategy.card";
import {Button} from "@client/components/custom/button";
import {Card} from "@client/components/ui/card";
import AddListStrategy from "@client/pages/feature/strategy/add-strategy";

export default function ListStrategy() {
  const {token} = useAuth()
  const {id} = useParams()
  const {strategies, fetchStrategies} = useFeature()
  const [open, setOpen] = React.useState(false);


  const fetchData = useCallback(() => {
    if (token && id) {
      fetchStrategies(id)
    }
  }, [id, token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      {strategies.map(s => <StrategyCard onReload={fetchData} strategy={s} key={s._id}/>)}

      <Card className="p-3 shadow-lg dark:border rounded-lg">
        <div className="w-full py-16 flex justify-center">
          <Button onClick={() => setOpen(true)}>Add strategy</Button>
        </div>
      </Card>
      <AddListStrategy onReload={fetchData} open={open} onOpenChange={setOpen}/>
    </>
  )
}


