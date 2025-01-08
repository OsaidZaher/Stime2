"use client";

import React, { useState, useEffect } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Calendar } from "@/components/ui/calendar";

interface StudySession {
  startTime: string;
  duration: number;
  subject: {
    name: string;
  };
}

export function SubjectContent() {
  const [mostStudiedSubject, setMostStudiedSubject] =
    useState<string>("None yet!");

  useEffect(() => {
    const fetchMostStudiedSubject = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        const data: StudySession[] = await response.json();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const recentSessions = data.filter((session: StudySession) => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= startOfMonth && sessionDate < endOfMonth;
        });

        const subjectTotals: Record<string, number> = recentSessions.reduce(
          (acc: Record<string, number>, session: StudySession) => {
            const { subject, duration } = session;
            if (!acc[subject.name]) {
              acc[subject.name] = 0;
            }
            acc[subject.name] += duration;
            return acc;
          },
          {}
        );

        const mostStudied =
          Object.entries(subjectTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([subject]) => subject)[0] || "None yet!";

        setMostStudiedSubject(mostStudied);
      } catch (error) {
        console.error("Error fetching most studied subject:", error);
        setMostStudiedSubject("Error fetching subject");
      }
    };

    fetchMostStudiedSubject();
  }, []);

  return (
    <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-8xl text-center mt-16">
      {mostStudiedSubject}
    </h1>
  );
}

export function HoursStudyContent() {
  const [thisMonthTotal, setThisMonthTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StudySession[] = await response.json();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const thisMonthSessions = data.filter(
          (session: StudySession) => new Date(session.startTime) >= startOfMonth
        );

        const thisMonthHours = thisMonthSessions.reduce(
          (total: number, session: StudySession) =>
            total + session.duration / 3600,
          0
        );

        setThisMonthTotal(Number(thisMonthHours.toFixed(2)));
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-8xl text-center mt-16">
      {thisMonthTotal}
    </h1>
  );
}

const chartData = [
  { month: "", desktop: 186, mobile: 80 },
  { month: "", desktop: 305, mobile: 200 },
  { month: "", desktop: 237, mobile: 120 },
  { month: "", desktop: 73, mobile: 190 },
  { month: "", desktop: 209, mobile: 130 },
  { month: "", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "trends",
    color: "purple",
    icon: TrendingDown,
  },
  mobile: {
    label: "trends",
    color: "blue",
    icon: TrendingUp,
  },
} satisfies ChartConfig;
export function DemoChart() {
  return (
    <div className="w-full border-black rounded-lg p-4 outline-1">
      {" "}
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 15, right: 15 }}
          height={270}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.7}
            stroke="blue-300"
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke=""
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}
