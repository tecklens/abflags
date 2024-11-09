import {Card, CardContent, CardHeader, CardTitle} from "@client/components/ui/card";
import React from "react";

export default function ApiInsights() {
  return (
    <Card>
      <CardHeader>
        <div className={'flex justify-between'}>
          <CardTitle className={'text-xl'}>Total API</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={'flex gap-4 md:gap-8 md:h-[250px] flex justify-center'}>
        <span className={'my-8 font-semibold text-xl'}>Coming Soon</span>
      </CardContent>
    </Card>
  )
}
