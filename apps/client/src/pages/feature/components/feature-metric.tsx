"use client"

import {CartesianGrid, Line, LineChart, XAxis} from "recharts"

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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {ApplicationSelect} from "@client/pages/feature/components/application-select";

export const description = "A multiple line chart"

const chartData = [
  {month: "January", desktop: 186, mobile: 80, mobile2: 84},
  {month: "February", desktop: 305, mobile: 200, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
  {month: "May", desktop: 209, mobile: 130, mobile2: 84},
  {month: "June", desktop: 214, mobile: 140, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
  {month: "January", desktop: 186, mobile: 80, mobile2: 84},
  {month: "February", desktop: 305, mobile: 200, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
  {month: "May", desktop: 209, mobile: 130, mobile2: 84},
  {month: "June", desktop: 214, mobile: 140, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
  {month: "March", desktop: 237, mobile: 120, mobile2: 184},
  {month: "April", desktop: 73, mobile: 190, mobile2: 84},
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  mobile2: {
    label: "Mobile2",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function FeatureMetric() {
  return (
    <Card>
      <CardHeader>
        <div className={'flex justify-between'}>
          <div>
            <CardTitle>Metric client call api feature flag</CardTitle>
            <CardDescription>Requests in the last 24 hours (local time)</CardDescription>
          </div>
          <div className={'flex gap-2'}>
            <ApplicationSelect
              title={'Applications'}
            />
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
      <CardContent>
        <ChartContainer config={chartConfig} className={'aspect-video'}>
          <LineChart
            accessibilityLayer
            data={chartData}
            height={200}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false}/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile2"
              type="monotone"
              stroke="var(--color-mobile2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <IconTrendingUp className="h-4 w-4"/>
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
