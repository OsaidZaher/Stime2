"use client";

import { useState } from "react";
import { CalendarDays, Clock, Calendar, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

interface StudySessionsStatsProps {
  weekSessions: number;
  monthSessions: number;
  yearSessions: number;
  weekAverage: string;
  monthAverage: string;
  yearAverage: string;
}
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StudySessionsStats() {
  const [showAverage, setShowAverage] = useState(false);

  // Use SWR hook for fetching data
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR<StudySessionsStatsProps>("/api/functionality/stats", fetcher);

  const toggleView = () => {
    setShowAverage(!showAverage);
  };

  if (isLoading) {
    return (
      <>
        <StudySessionsSkeleton />
      </>
    );
  }

  if (error || !stats) {
    return (
      <Card className="w-full max-w-lg h-[250px] mx-auto">
        <CardContent className="flex items-center justify-center h-full">
          <p>Failed to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg h-[250px] mx-auto shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-2">
          <CardTitle>
            {showAverage
              ? "Average Study Session Length"
              : "Total Study Sessions"}
          </CardTitle>
          <CardDescription>
            {showAverage
              ? "See how long each session is on average"
              : "See how many sessions you had"}
          </CardDescription>
        </div>
        <Button size="icon" onClick={toggleView} className="bg-color-500">
          <RotateCcw className="h-4 w-4 " />
          <span className="sr-only">Toggle view</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          <div className="flex items-center space-x-4">
            <CalendarDays className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Week
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? stats.weekAverage : stats.weekSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? stats.monthAverage : stats.monthSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Year
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? stats.yearAverage : stats.yearSessions}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
function StudySessionsSkeleton() {
  return (
    <Card className="w-full max-w-lg mx-auto shadow-md rounded-xl overflow-hidden border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <Skeleton className="h-9 w-[100px]" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
