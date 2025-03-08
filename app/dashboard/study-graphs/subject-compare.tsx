"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  isDummy?: boolean;
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

const RADIAN = Math.PI / 180;

// Function to format duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

const StudyStatistics5 = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);
  const [isDummyData, setIsDummyData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const fetchStudySessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/functionality/studySession");
      const data: StudySession[] = await response.json();

      // Process data and check if we need dummy data in one step
      const processedData = processStudySessions(data);
      if (processedData.length === 0) {
        setDummyData();
      } else {
        setChartData(processedData);
        setIsDummyData(false);
      }
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      setDummyData();
    } finally {
      setIsLoading(false);
    }
  };

  const setDummyData = () => {
    const dummyMessages = [
      "Start a study session!",
      "You have yet to study!",
      "Wanna start a study session?",
      "Time to study!",
      "No subjects found",
    ];

    const dummyData: ChartDataItem[] = dummyMessages.map((subject, index) => ({
      subject,
      time: 20,
      fill: colors[index % colors.length],
      isDummy: true,
    }));

    setChartData(dummyData);
    setIsDummyData(true);
  };

  const capitalizeWord = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const processStudySessions = (sessions: StudySession[]): ChartDataItem[] => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= sevenDaysAgo;
    });

    if (recentSessions.length === 0) {
      return [];
    }

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

    return Object.entries(subjectTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([subject, time], index) => ({
        subject,
        time,
        fill: colors[index % colors.length],
        isDummy: false,
      }));
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Generate chart config from chart data
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      // If it's dummy data, just show the section name
      if (dataPoint.isDummy) {
        return (
          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
            {capitalizeWord(dataPoint.subject)}
          </div>
        );
      }

      // For real data, show name and time
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          {capitalizeWord(dataPoint.subject)}: {formatDuration(dataPoint.time)}
        </div>
      );
    }

    return null;
  };

  // Shared title component for both views
  const titleComponent = (
    <CardTitle className="text-xl font-semibold text-center flex flex-col">
      Your Most Studied Subjects
    </CardTitle>
  );

  // Skeleton for visualization view
  const VisualizationSkeleton = () => (
    <>
      <CardHeader className="pb-2">
        <Skeleton className="h-8 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mx-auto aspect-square h-[250px] flex items-center justify-center">
          <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
            <Skeleton className="absolute inset-0 rounded-full" />
          </div>
        </div>
      </CardContent>
    </>
  );

  // Skeleton for leaderboard view
  const LeaderboardSkeleton = () => (
    <>
      <CardHeader>
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {[1, 2, 3, 4, 5].map((index) => (
            <li key={index} className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-36" />
            </li>
          ))}
        </ul>
      </CardContent>
    </>
  );

  const renderContent = () => {
    if (isLoading) {
      return showVisualization ? (
        <VisualizationSkeleton />
      ) : (
        <LeaderboardSkeleton />
      );
    }

    if (showVisualization) {
      return (
        <>
          <CardHeader className="pb-2">{titleComponent}</CardHeader>
          <CardContent className="pb-4">
            <ChartContainer
              className="mx-auto aspect-square h-[250px]"
              config={chartConfig}
            >
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip content={<CustomTooltip />} cursor={false} />
                  <Pie
                    data={chartData}
                    dataKey="time"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    activeShape={renderActiveShape}
                    activeIndex={0}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </>
      );
    } else {
      return (
        <>
          <CardHeader>
            {titleComponent}
            <CardDescription className="text-center">
              Past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["🥇", "🥈", "🥉", "4.", "5."].map((rank, index) => (
                <li key={rank} className="flex items-center space-x-2">
                  <span className="text-2xl w-8 text-center">{rank}</span>
                  <span className="text-lg">
                    {chartData[index] && !chartData[index].isDummy
                      ? capitalizeWord(chartData[index].subject)
                      : "No subject yet"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </>
      );
    }
  };

  return (
    <Card className="w-[550px] flex flex-col h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      {renderContent()}
      <CardFooter className="mt-auto">
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Button
            onClick={() => setShowVisualization(!showVisualization)}
            className="w-full bg-color-500"
          >
            {showVisualization ? "Show Leaderboard" : "Show Visualization"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudyStatistics5;
