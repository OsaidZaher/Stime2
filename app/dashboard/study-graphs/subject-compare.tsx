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

const RADIAN = Math.PI / 180;

const StudyStatistics5 = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const fetchStudySessions = async () => {
    try {
      const response = await fetch("/api/functionality/studySession");
      const data: StudySession[] = await response.json();
      processStudySessions(data);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
    }
  };

  const capitalizeWord = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const processStudySessions = (sessions: StudySession[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= sevenDaysAgo;
    });

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

    const sortedSubjects = Object.entries(subjectTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const processedData: ChartDataItem[] = sortedSubjects.map(
      ([subject, time], index) => ({
        subject,
        time,
        fill: colors[index % colors.length],
      })
    );

    setChartData(processedData);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    subject,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {capitalizeWord(`${subject}`)}
      </text>
    );
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

  const renderContent = () => {
    if (showVisualization) {
      return (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-center">
              Study Pie
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {chartData.length > 0 ? (
              <ChartContainer
                className="mx-auto aspect-square h-[250px]"
                config={chartConfig}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="time"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={renderCustomizedLabel}
                      activeShape={renderActiveShape}
                      activeIndex={0}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center mt-4">No data available</div>
            )}
          </CardContent>
        </>
      );
    } else {
      return (
        <>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Your Most Studied Subjects
            </CardTitle>
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
                    {chartData[index]
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
    <Card className=" w-[550px] flex flex-col h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      {renderContent()}
      <CardFooter className="mt-auto">
        <Button
          onClick={() => setShowVisualization(!showVisualization)}
          className="w-full bg-color-500"
        >
          {showVisualization ? "Show Leaderboard" : "Show Visualization"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyStatistics5;
