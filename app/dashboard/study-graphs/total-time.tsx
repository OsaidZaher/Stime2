"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
  week: string;
  hours: number;
}

interface StudySession {
  startTime: string;
  duration: number;
}

const chartConfig = {
  hours: {
    label: "Study Hours",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TotalTimeChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [thisWeekTotal, setThisWeekTotal] = useState(0);
  const [lastWeekTotal, setLastWeekTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StudySession[] = await response.json();

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekSessions = data.filter(
          (session) => new Date(session.startTime) >= oneWeekAgo
        );
        const lastWeekSessions = data.filter(
          (session) =>
            new Date(session.startTime) >= twoWeeksAgo &&
            new Date(session.startTime) < oneWeekAgo
        );

        const thisWeekHours = thisWeekSessions.reduce(
          (total, session) => total + session.duration / 3600,
          0
        );
        const lastWeekHours = lastWeekSessions.reduce(
          (total, session) => total + session.duration / 3600,
          0
        );

        setChartData([
          { week: "Previous Week", hours: Number(lastWeekHours.toFixed(2)) },
          { week: "This Week", hours: Number(thisWeekHours.toFixed(2)) },
        ]);

        setThisWeekTotal(Number(thisWeekHours.toFixed(2)));
        setLastWeekTotal(Number(lastWeekHours.toFixed(2)));
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-[700px]">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-base font-medium">
          Total Study Time
        </CardTitle>
        <CardDescription className="text-sm">
          This Week vs Previous Week
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="hours"
                fill="var(--color-hours)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-1 font-medium leading-none">
              This week: {thisWeekTotal} hours
            </div>
            <p className="text-xs text-muted-foreground">
              Previous week: {lastWeekTotal} hours
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
