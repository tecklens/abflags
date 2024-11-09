import {Card, CardContent, CardHeader, CardTitle} from "@client/components/ui/card";
import {Separator} from "@client/components/ui/separator";
import {Button} from "@client/components/custom/button";
import {IconChevronRight} from "@tabler/icons-react";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@client/components/ui/chart";
import {CartesianGrid, ComposedChart, Line, ReferenceArea, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {CategoricalChartState} from "recharts/types/chart/types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@client/components/ui/select";
import {RepositoryFactory} from "@client/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {nFormatter} from "@client/lib/utils";
import {get} from "lodash";
import {Link} from "react-router-dom";

const FeatureRepository = RepositoryFactory.get('feature')

const chartConfig: ChartConfig = {
  totalUser: {
    label: "Total users",
    color: "hsl(var(--chart-1))",
  },
};
export default function UserInsight() {
  const [data, setData] = useState<any>({});
  const [selecting, setSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState('hour')

  const fetchData = () => {
    FeatureRepository.analysisCustomer({
      page: 0,
      limit: 50,
    }).then((resp: AxiosResponse) => {
      if (resp.status === HttpStatusCode.Ok) {
        setData(resp.data)
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const memoizedChart = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={get(data, 'series') ?? []}
          margin={{top: 10, right: 10, left: 0, bottom: 0}}
        >
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={7}
            // tickFormatter={(value) => {
            //   const date = new Date(value);
            //   return `${String(date.getMonth() + 1).padStart(2, "0")}/${date
            //     .getFullYear()
            //     .toString()
            //     .slice(-2)}`;
            // }}
            style={{userSelect: "none"}}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={40}
            // domain={[100, 350]}
            style={{userSelect: "none"}}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />

          {Object.entries(chartConfig).map(([key, config]) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartLegend content={<ChartLegendContent/>}/>
        </ComposedChart>
      </ResponsiveContainer>
    ),
    [
      period,
      data,
    ]
  );

  return (
    <Card>
      <CardHeader>
        <div className={'flex justify-between'}>
          <CardTitle className={'text-xl'}>Total user</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={'flex gap-4 md:gap-8 md:h-[250px]'}>
        <div className={'flex flex-col gap-4 md:gap-8 min-w-56'}>
          <div className={'text-2xl md:text-3xl px-8 py-6 rounded-2xl bg-primary font-bold text-white shadow-lg'}>
            {nFormatter(data?.total ?? 0, 2)}
          </div>

          <Link to={'/customer'} className={'flex justify-end'}>
            <Button variant={'ghost'}>View users <IconChevronRight size={18}/></Button>
          </Link>
        </div>
        <Separator orientation={'vertical'}/>
        <div className={'flex-1'}>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <div
              className="h-full"
              ref={chartRef}
              style={{touchAction: "none", overflow: "hidden"}}
            >
              {memoizedChart}
            </div>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
