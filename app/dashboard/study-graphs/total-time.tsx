"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface ChartDataItem {
  label: string;
  minutes: number;
  display: string;
}

interface StudySession {
  startTime: string;
  duration: number;
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} minutes`;
  }
};

export default function TotalTimeChart() {
  const [timeFrame, setTimeFrame] = useState("week");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [currentTotal, setCurrentTotal] = useState("");
  const [previousTotal, setPreviousTotal] = useState("");

  const getTimeFrameData = (data: StudySession[], timeFrame: string) => {
    const now = new Date();
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    let periodLabel: string;

    switch (timeFrame) {
      case "day":
        currentPeriodStart = new Date(now.setHours(0, 0, 0, 0));
        previousPeriodStart = new Date(
          currentPeriodStart.getTime() - 24 * 60 * 60 * 1000
        );
        periodLabel = "Day";
        break;
      case "week":
        currentPeriodStart = new Date(
          now.setDate(now.getDate() - now.getDay())
        );
        previousPeriodStart = new Date(
          currentPeriodStart.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        periodLabel = "Week";
        break;
      case "month":
        currentPeriodStart = new Date(now.setDate(1));
        previousPeriodStart = new Date(
          new Date(now).setMonth(now.getMonth() - 1)
        );
        periodLabel = "Month";
        break;
      default:
        currentPeriodStart = new Date(
          now.setDate(now.getDate() - now.getDay())
        );
        previousPeriodStart = new Date(
          currentPeriodStart.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        periodLabel = "Week";
    }

    const currentPeriodSessions = data.filter(
      (session) => new Date(session.startTime) >= currentPeriodStart
    );
    const previousPeriodSessions = data.filter(
      (session) =>
        new Date(session.startTime) >= previousPeriodStart &&
        new Date(session.startTime) < currentPeriodStart
    );

    const currentSeconds = currentPeriodSessions.reduce(
      (total, session) => total + session.duration,
      0
    );
    const previousSeconds = previousPeriodSessions.reduce(
      (total, session) => total + session.duration,
      0
    );

    return {
      chartData: [
        {
          label: `Previous ${periodLabel}`,
          minutes: previousSeconds / 60,
          display: formatDuration(previousSeconds),
        },
        {
          label: `Current ${periodLabel}`,
          minutes: currentSeconds / 60,
          display: formatDuration(currentSeconds),
        },
      ],
      currentTotal: formatDuration(currentSeconds),
      previousTotal: formatDuration(previousSeconds),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StudySession[] = await response.json();

        const {
          chartData: newChartData,
          currentTotal,
          previousTotal,
        } = getTimeFrameData(data, timeFrame);

        setChartData(newChartData);
        setCurrentTotal(currentTotal);
        setPreviousTotal(previousTotal);
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div className="">
      <Card className="w-full max-w-[700px] mt-4">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Frame</SelectLabel>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-base font-bold">
            Total Study Time
          </CardTitle>
          <CardDescription className="text-sm">
            {timeFrame === "day"
              ? "Today vs Yesterday"
              : timeFrame === "week"
              ? "This Week vs Previous Week"
              : "This Month vs Previous Month"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="w-full h-[525px]">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any) => [
                    `${formatDuration(Number(value) * 60)}`,
                    "Study Time",
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar
                  dataKey="minutes"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  barSize={100}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-1">
              <div className="flex items-center gap-1 font-medium leading-none">
                {timeFrame === "day"
                  ? "Today"
                  : timeFrame === "week"
                  ? "This week"
                  : "This month"}
                : {currentTotal}
              </div>
              <p className="text-xs text-muted-foreground">
                {timeFrame === "day"
                  ? "Yesterday"
                  : timeFrame === "week"
                  ? "Previous week"
                  : "Previous month"}
                : {previousTotal}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
