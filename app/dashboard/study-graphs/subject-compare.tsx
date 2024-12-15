"use client";

import React, { useState, useEffect } from "react";
import { Pie, PieChart, Sector, ResponsiveContainer } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
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

// Define interfaces for type safety
interface StudySession {
  startTime: string;
  duration: number;
  subject: {
    name: string;
  };
}

interface ChartDataItem {
  subject: string;
  time: number;
  fill: string;
}

interface ChartConfigItem {
  label: string;
  color: string;
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SubjectStudyChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [mostStudiedSubject, setMostStudiedSubject] = useState<string>("");

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const fetchStudySessions = async () => {
    try {
      const response = await fetch("/api/functionality/studySession");
      const data: StudySession[] = await response.json();
      console.log("All fetched data:", data);
      processStudySessions(data);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
    }
  };

  const processStudySessions = (sessions: StudySession[]) => {
    console.log("All sessions:", sessions);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= sevenDaysAgo;
    });

    console.log("Recent sessions:", recentSessions);

    const subjectTotals: Record<string, number> = recentSessions.reduce(
      (acc, session) => {
        const { subject, duration } = session;
        if (!acc[subject.name]) {
          acc[subject.name] = 0;
        }
        acc[subject.name] += duration;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("Subject totals:", subjectTotals);

    const sortedSubjects = Object.entries(subjectTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    console.log("Sorted subjects:", sortedSubjects);

    const processedData: ChartDataItem[] = sortedSubjects.map(
      ([subject, time], index) => ({
        subject,
        time,
        fill: colors[index % colors.length],
      })
    );

    console.log("Processed chart data:", processedData);
    setChartData(processedData);
    setMostStudiedSubject(sortedSubjects[0]?.[0] || "No subjects studied");
  };

  const chartConfig: Record<string, ChartConfigItem> = chartData.reduce(
    (acc, item, index) => {
      acc[`color${index + 1}`] = {
        label: item.subject,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, ChartConfigItem>
  );

  const renderActiveShape = (props: PieSectorDataItem) => {
    return <Sector {...props} outerRadius={(props.outerRadius || 0) + 10} />;
  };

  return (
    <Card className="w-full max-w-[700px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 studied subjects!</CardTitle>
        <CardDescription>Past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={chartData}
                  dataKey="time"
                  nameKey="subject"
                  innerRadius={60}
                  outerRadius={120}
                  strokeWidth={5}
                  activeIndex={0}
                  activeShape={renderActiveShape}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-center mt-4">
            No data available for the past 7 days
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Your most studied subject is {mostStudiedSubject}!
        </div>
        <div className="leading-none text-muted-foreground">
          Based on total study time in the last 7 days.
        </div>
      </CardFooter>
    </Card>
  );
}
