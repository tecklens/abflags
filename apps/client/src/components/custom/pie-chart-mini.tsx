import {Pie, PieChart} from "recharts";
import {ChartContainer} from "@client/components/ui/chart";

const chartData = [
  {browser: "chrome", visitors: 275, fill: "var(--color-chrome)"},
  {browser: "safari", visitors: 200, fill: "var(--color-safari)"},
  {browser: "firefox", visitors: 187, fill: "var(--color-firefox)"},
  {browser: "edge", visitors: 173, fill: "var(--color-edge)"},
  {browser: "other", visitors: 90, fill: "var(--color-other)"},
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export default function PieChartMini({className = ''}: {className?: string}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={`mx-auto aspect-square max-h-[40px] max-w-[40px] ${className}`}
    >
      <PieChart>
        <Pie data={chartData} dataKey="visitors" nameKey="browser"/>
      </PieChart>
    </ChartContainer>
  )
}
