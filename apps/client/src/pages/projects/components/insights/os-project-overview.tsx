"use client"

import {LabelList, RadialBar, RadialBarChart} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@client/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@client/components/ui/chart"
import {IconTrendingUp} from "@tabler/icons-react";
import {memo, useEffect, useState} from "react";
import {RepositoryFactory} from "@client/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {useToast} from "@client/components/ui/use-toast";
import {useAuth} from "@client/context/auth";
import {get} from "lodash";

const MetricRepository = RepositoryFactory.get('metric')

export const description = "A radial chart with a label"

const chartData = [
  {os: "mac-os", visitors: 0, fill: "var(--color-mac-os)"},
  {os: "android", visitors: 0, fill: "var(--color-android)"},
  {os: "window", visitors: 0, fill: "var(--color-window)"},
  {os: "linux", visitors: 0, fill: "var(--color-linux)"},
  {os: "ios", visitors: 0, fill: "var(--color-ios)"},
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  'mac-os': {
    label: "Mac OS",
    color: "hsl(var(--chart-1))",
  },
  android: {
    label: "Android",
    color: "hsl(var(--chart-2))",
  },
  window: {
    label: "Window",
    color: "hsl(var(--chart-3))",
  },
  linux: {
    label: "Linux",
    color: "hsl(var(--chart-4))",
  },
  ios: {
    label: "IOS",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const OsProjectOverview = memo(() => {
  const {toast} = useToast()
  const {token} = useAuth()
  const [data, setData] = useState({})

  const fetchData = () => {
    MetricRepository.analyseProject()
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          setData(resp.data)
        }
      })
      .catch((err: any) => {
        toast({
          variant: 'destructive',
          title: err.message
        })
      })
  }

  useEffect(() => {
    if (token)
      fetchData()
  }, [token])

  const finalData = chartData.map(e => ({
    ...e,
    visitors: get(data, e.os) ?? 0
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Usage by OS</CardTitle>
        {/*<CardDescription>January - June 2024</CardDescription>*/}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadialBarChart
            data={finalData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
            barGap={10}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="os"/>}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="os"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={10}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter className="flex-col gap-2 text-sm">*/}
      {/*  <div className="flex items-center gap-2 font-medium leading-none">*/}
      {/*    Trending up by 5.2% this month <IconTrendingUp className="h-4 w-4"/>*/}
      {/*  </div>*/}
      {/*  <div className="leading-none text-muted-foreground">*/}
      {/*    Showing total visitors for the last 6 months*/}
      {/*  </div>*/}
      {/*</CardFooter>*/}
    </Card>
  )
})

export default OsProjectOverview;
