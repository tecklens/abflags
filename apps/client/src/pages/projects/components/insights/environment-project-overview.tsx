"use client"

import * as React from "react"
import {Label, Pie, PieChart, Sector} from "recharts"
import {PieSectorDataItem} from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@client/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@client/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@client/components/ui/select"
import {memo, useEffect, useState} from "react";
import {useToast} from "@client/components/ui/use-toast";
import {useAuth} from "@client/context/auth";
import {AxiosResponse, HttpStatusCode} from "axios";
import {get} from "lodash";
import {RepositoryFactory} from "@client/api/repository-factory";

const MetricRepository = RepositoryFactory.get('metric')
export const description = "An interactive pie chart"

const desktopData = [
  {env: "browser", value: 0, fill: "var(--color-browser)"},
  {env: "backend", value: 0, fill: "var(--color-backend)"},
  {env: "web-worker", value: 0, fill: "var(--color-web-worker)"},
]

const chartConfig = {
  browser: {
    label: "Browser",
    color: "hsl(var(--chart-1))",
  },
  backend: {
    label: "Backend",
    color: "hsl(var(--chart-2))",
  },
  'web-worker': {
    label: "Web Worker",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const EnvironmentProjectOverview = memo(() => {
  const {toast} = useToast()
  const {token} = useAuth()
  const [data, setData] = useState({})

  const fetchData = () => {
    MetricRepository.analyseByEnv()
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

  const finalData = desktopData.map(e => ({
    ...e,
    value: get(data, e.env) ?? 0
  }))
  const id = "pie-interactive"
  const [activeMonth, setActiveMonth] = React.useState(finalData[0].env)

  const activeIndex = React.useMemo(
    () => finalData.findIndex((item) => item.env === activeMonth),
    [activeMonth, finalData]
  )
  const envs = React.useMemo(() => desktopData.map((item) => item.env), [])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig}/>
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Number of accesses by the usage</CardTitle>
          {/*<CardDescription>January - June 2024</CardDescription>*/}
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select env"/>
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {envs.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {(!finalData || finalData.length <= 0) && <div>Empty data</div>}
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel/>}
            />
            <Pie
              data={finalData}
              dataKey="value"
              nameKey="env"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                              outerRadius = 0,
                              ...props
                            }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10}/>
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({viewBox}) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {finalData[activeIndex].value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          times of use
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

export default EnvironmentProjectOverview;
