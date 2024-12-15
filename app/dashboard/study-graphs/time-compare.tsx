"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataItem {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

interface TrendState {
  percentage: number;
  isUp: boolean;
}

const chartConfig = {
  thisWeek: {
    label: "This Week",
    color: "hsl(var(--chart-1))",
  },
  lastWeek: {
    label: "Previous Week ",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ComparativeChart({
  initialData,
  initialTrend,
}: {
  initialData: ChartDataItem[];
  initialTrend: TrendState;
}) {
  const [chartData, setChartData] = useState<ChartDataItem[]>(initialData);
  const [trend, setTrend] = useState<TrendState>(initialTrend);

  return (
    <Card className="w-full max-w-[700px]">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-base font-medium">
          Weekly Comparison
        </CardTitle>
        <CardDescription className="text-sm">
          Study time: This week vs last
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="lastWeek"
                stackId="1"
                stroke="var(--color-lastWeek)"
                fill="var(--color-lastWeek)"
              />
              <Area
                type="monotone"
                dataKey="thisWeek"
                stackId="1"
                stroke="var(--color-thisWeek)"
                fill="var(--color-thisWeek)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-1 font-medium leading-none">
              {trend.isUp ? "Trending up" : "Trending down"} by{" "}
              {trend.percentage.toFixed(1)}% this week
              {trend.isUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to last week's performance
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
