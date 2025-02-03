"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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

interface StudySession {
  startTime: string;
  duration: number;
  subject: {
    name: string;
  };
}

interface ChartDataItem {
  subject: string;
  duration: number;
}

const chartConfig: ChartConfig = {
  duration: {
    label: "Study Time",
    color: "hsl(var(--chart-1))",
  },
};

export function SubjectHexagon() {
  const [subjectData, setSubjectData] = useState<ChartDataItem[]>([]);
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

    const subjectTotals = recentSessions.reduce<Record<string, number>>(
      (acc, session) => {
        const { subject, duration } = session;
        if (!acc[subject.name]) {
          acc[subject.name] = 0;
        }
        acc[subject.name] += duration;
        return acc;
      },
      {}
    );

    const sortedSubjects = Object.entries(subjectTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    const processedData: ChartDataItem[] = sortedSubjects.map(
      ([subject, duration]) => ({
        subject,
        duration,
      })
    );

    console.log("Processed chart data:", processedData);
    setSubjectData(processedData);
    setMostStudiedSubject(sortedSubjects[0]?.[0] || "No subjects studied");
  };

  return (
    <Card className="w-full max-w-[700px] mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Top 6 studied subjects!</CardTitle>
        <CardDescription>Past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {subjectData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="w-full aspect-square max-w-[500px] mx-auto"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <PolarGrid />
                <Radar
                  dataKey="duration"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.8}
                  stroke="hsl(var(--chart-1))"
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="mt-4 text-center">
            No data available for the past 7 days
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Your most studied subject is {mostStudiedSubject}!
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on total study time in the last 7 days.
        </div>
      </CardFooter>
    </Card>
  );
}

export default SubjectHexagon;
