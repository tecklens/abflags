"use client"

import {Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis} from "recharts"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@client/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@client/components/ui/chart"
import {IconTrendingUp} from "@tabler/icons-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {useMetric} from "@client/lib/store/metricStore";
import {IFeature} from "@abflags/shared";
import {useEffect, useState} from "react";

export const description = "A multiple line chart"

const chartConfig = {
  yes: {
    label: "Visible",
    color: "hsl(var(--chart-1))",
  },
  no: {
    label: "Invisible",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function FeatureMetric({feature}: { feature: IFeature }) {
  const {metrics, fetchMetric} = useMetric()
  const [period, setPeriod] = useState('hour')

  useEffect(() => {
    if (feature) {
      fetchMetric(period, feature.name)
    }
  }, [period, feature])

  return (
    <Card>
      <CardHeader>
        <div className={'flex justify-between'}>
          <div>
            <CardTitle>Metric client call api feature flag</CardTitle>
            <CardDescription>Requests in the last 24 hours (local time)</CardDescription>
          </div>
          <div className={'flex gap-2'}>
            <Select
            >
              <SelectTrigger className='h-8 min-w-[130px]'>
                <SelectValue placeholder={'Period'}/>
              </SelectTrigger>
              <SelectContent side='top'>
                {['Last hour', 'Last 12 hour', 'Last 24 hour', 'Last 48 hour'].map((period) => (
                  <SelectItem key={period} value={`${period}`}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className={'w-full flex justify-center'}>
        <ChartContainer config={chartConfig} className={'w-full h-[300px]'}>
          <ResponsiveContainer minHeight={100} width="100%" height="100%">
            <BarChart accessibilityLayer data={metrics ?? []}>
              <CartesianGrid vertical={false}/>
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel/>}/>
              <ChartLegend content={<ChartLegendContent/>}/>
              <Bar
                dataKey="yes"
                stackId="a"
                fill="var(--color-yes)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="no"
                stackId="a"
                fill="var(--color-no)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        {/*<div className="flex w-full items-start gap-2 text-sm">*/}
        {/*  <div className="grid gap-2">*/}
        {/*    <div className="flex items-center gap-2 font-medium leading-none">*/}
        {/*      Trending up by 5.2% this month <IconTrendingUp className="h-4 w-4"/>*/}
        {/*    </div>*/}
        {/*    <div className="flex items-center gap-2 leading-none text-muted-foreground">*/}
        {/*      Showing total visitors for the last 6 months*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </CardFooter>
    </Card>
  )
}
