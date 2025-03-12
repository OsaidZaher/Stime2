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
    <Card className="w-full max-w-lg h-auto sm:h-[250px] mx-auto shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 sm:pb-4">
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-0">
          <CardTitle className="text-base sm:text-lg">
            {showAverage
              ? "Average Study Session Length"
              : "Total Study Sessions"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {showAverage
              ? "See how long each session is on average"
              : "See how many sessions you had"}
          </CardDescription>
        </div>
        <Button size="sm" onClick={toggleView} className="bg-color-500">
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Toggle</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 p-2 sm:p-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                This Week
              </p>
              <p className="text-xl sm:text-3xl font-bold">
                {showAverage ? stats.weekAverage : stats.weekSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                This Month
              </p>
              <p className="text-xl sm:text-3xl font-bold">
                {showAverage ? stats.monthAverage : stats.monthSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                This Year
              </p>
              <p className="text-xl sm:text-3xl font-bold">
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-0 pb-2 sm:pb-3">
        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-5 sm:h-6 w-[150px] sm:w-[200px]" />
          <Skeleton className="h-3 sm:h-4 w-[180px] sm:w-[250px]" />
        </div>
        <Skeleton className="h-8 sm:h-9 w-[80px] sm:w-[100px] mt-2 sm:mt-0" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 sm:space-x-4 p-1 sm:p-2"
            >
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
              <div className="space-y-1 sm:space-y-2">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
