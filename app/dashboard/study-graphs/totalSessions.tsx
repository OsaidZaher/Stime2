"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, Calendar, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudySessionsStatsProps {
  weekSessions: number;
  monthSessions: number;
  yearSessions: number;
  weekAverage: string;
  monthAverage: string;
  yearAverage: string;
}

export function StudySessionsStats() {
  const [showAverage, setShowAverage] = useState(false);
  const [stats, setStats] = useState<StudySessionsStatsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/functionality/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleView = () => {
    setShowAverage(!showAverage);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-lg h-[250px] mx-auto">
        <CardContent className="flex items-center justify-center h-full">
          <p>Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="w-full max-w-lg h-[250px] mx-auto">
        <CardContent className="flex items-center justify-center h-full">
          <p>Failed to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg h-[250px] mx-auto">
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
        <Button size="icon" onClick={toggleView}>
          <RotateCcw className="h-4 w-4" />
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
