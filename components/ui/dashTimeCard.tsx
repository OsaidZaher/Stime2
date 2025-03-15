"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Target, Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useSWR, { mutate } from "swr";
import type { WeeklyGoal, StudySession } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CombinedDashboardCard() {
  const {
    data: weeklyGoal,
    error: weeklyGoalError,
    isLoading: weeklyGoalLoading,
  } = useSWR<WeeklyGoal>("/api/functionality/weeklyGoal", fetcher);

  const {
    data: studySessions,
    error: studySessionsError,
    isLoading: studySessionsLoading,
  } = useSWR<StudySession[]>("/api/functionality/studySession", fetcher);

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<number>(7);
  const [todayStudyTime, setTodayStudyTime] = useState<string>("0 mins");
  const [streak, setStreak] = useState<number>(0);

  const loginCount = weeklyGoal?.completion ?? 0;
  const progress = (loginCount / target) * 100;
  const daysLeft = target - loginCount;

  // Handle updating the weekly goal target
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/functionality/weeklyGoal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: target,
          completion: loginCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      await mutate("/api/functionality/weeklyGoal");
      setOpen(false);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  // Calculate today's study time from study sessions
  useEffect(() => {
    if (studySessions && studySessions.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaySessions = studySessions.filter((session) => {
        const sessionCreation = new Date(session.startTime);
        return sessionCreation >= today;
      });

      const totalMinutes = Math.floor(
        todaySessions.reduce((total, session) => total + session.duration, 0) /
          60
      );

      if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const remainingMins = totalMinutes % 60;
        if (remainingMins === 0) {
          setTodayStudyTime(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
        } else {
          setTodayStudyTime(
            `${hours} ${hours === 1 ? "hr" : "hrs"} ${remainingMins} mins`
          );
        }
      } else {
        setTodayStudyTime(`${totalMinutes} mins`);
      }
    }
  }, [studySessions]);

  // Handle tracking of login streaks and weekly goal
  useEffect(() => {
    if (weeklyGoal?.target) {
      setTarget(weeklyGoal.target);
    }
    checkLoginToday();
  }, [weeklyGoal]);

  const checkLoginToday = async () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const lastLoginDate = localStorage.getItem("lastLoginDate");
    const isMonday = today.getDay() === 1;

    // Calculate streak
    let currentStreak = 1;
    if (lastLoginDate) {
      const lastLogin = new Date(lastLoginDate);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (
        lastLogin.toISOString().split("T")[0] ===
        yesterday.toISOString().split("T")[0]
      ) {
        // Last login was yesterday, continue streak
        currentStreak = parseInt(localStorage.getItem("streakCount") || "1");
        currentStreak++;
      } else if (lastLogin.toISOString().split("T")[0] !== todayStr) {
        // Last login wasn't yesterday or today, reset streak
        currentStreak = 1;
      } else {
        // Last login was today, maintain streak
        currentStreak = parseInt(localStorage.getItem("streakCount") || "1");
      }
    }

    localStorage.setItem("streakCount", currentStreak.toString());
    setStreak(currentStreak);

    // Reset weekly goal on Monday
    if (isMonday) {
      const lastMondayCheck = localStorage.getItem("lastMondayCheck");

      if (lastMondayCheck !== todayStr) {
        await updateCompletion(0);
        localStorage.setItem("lastMondayCheck", todayStr);

        if (lastLoginDate !== todayStr) {
          localStorage.setItem("lastLoginDate", todayStr);
          await updateCompletion(1);
        }
        return;
      }
    }

    // Update login tracking
    if (lastLoginDate !== todayStr) {
      localStorage.setItem("lastLoginDate", todayStr);
      const newCompletion = Math.min((weeklyGoal?.completion || 0) + 1, target);
      await updateCompletion(newCompletion);
    }
  };

  const updateCompletion = async (newCompletion: number) => {
    try {
      const response = await fetch("/api/functionality/weeklyGoal", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target,
          completion: newCompletion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update completion");
      }

      await mutate("/api/functionality/weeklyGoal");
    } catch (error) {
      console.error("Error saving completion:", error);
    }
  };

  const getMotivationalMessage = () => {
    if (loginCount === target)
      return "You have achieved your weekly goal, well done!🎉";
    if (loginCount / target >= 0.8)
      return "You are almost there, keep it up! 💪";
    if (loginCount / target >= 0.5)
      return "Halfway through the week! You're doing great! 👍";
    if (loginCount > 0)
      return "Great you have started! Now let's reach your goal 🚀";
    return "Start your weekly goals!🌟";
  };

  const isLoading = weeklyGoalLoading || studySessionsLoading;

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="bg-gradient-to-r from-primary/90 to-primary p-6 text-primary-foreground">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Welcome back!</h2>
            <p className="text-primary-foreground/80 mt-1">
              Here's your study progress
            </p>
          </div>

          {!isLoading && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-primary/10"
                >
                  <Pen className="h-4 w-4 theme-dark font-extrabold" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>What is your weekly login goal?</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit}
                  className="space-x-2 sm:space-x-4 py-2 flex flex-col sm:flex-row items-center"
                >
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    min="1"
                    max="7"
                    className="w-full sm:w-20 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center mb-2 sm:mb-0"
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Save changes
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {isLoading ? (
            <>
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </>
          ) : (
            <>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-md">
                    <Flame className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Streak</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {streak} {streak === 1 ? "day" : "days"}
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-md">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Today</span>
                </div>
                <p className="text-2xl font-bold mt-2">{todayStudyTime}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-md">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Goal</span>
                </div>
                <p className="text-2xl font-bold mt-2">{target} days</p>
              </div>
            </>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {isLoading ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full mb-2" />
            <Skeleton className="h-4 w-64" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Weekly Progress</h3>
              <span className="text-xs text-muted-foreground">
                {daysLeft} {daysLeft === 1 ? "day" : "days"} left
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {getMotivationalMessage()}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
