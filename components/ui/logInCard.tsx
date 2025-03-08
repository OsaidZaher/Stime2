"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeeklyGoal } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LogInCard() {
  const {
    data: weeklyGoal,
    error,
    isLoading,
  } = useSWR<WeeklyGoal>("/api/functionality/weeklyGoal", fetcher, {});

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<number>(7);

  const loginCount = weeklyGoal?.completion ?? 0;
  const progress = (loginCount / target) * 100;
  const daysLeft = target - loginCount;

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

  const getColorClass = () => {
    if (progress <= 20) return "text-yellow-400";
    if (progress <= 40) return "text-yellow-500";
    if (progress <= 60) return "text-yellow-600";
    if (progress <= 80) return "text-green-400";
    if (progress < 100) return "text-green-500";
    return "text-green-600";
  };

  return (
    <Card className="max-w-md min-w-max h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Weekly Streak</CardTitle>
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
            <DialogContent className="sm:max-w-[350px]">
              <DialogHeader>
                <DialogTitle>What is your weekly login goal?</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-x-4 py-2 flex">
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  min="1"
                  max="7"
                  className="w-20 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
                />
                <Button type="submit">Save changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {isLoading && <Skeleton className="h-8 w-8 rounded-full" />}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <>
            <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
              <Skeleton className="w-48 h-48 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48 mb-4" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : (
          <>
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`${getColorClass()} transition-all duration-500 ease-in-out`}
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * Math.min(progress, 100)) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-5xl font-bold">{loginCount}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  days
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Target: {target} days
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {daysLeft} day{daysLeft !== 1 ? "s" : ""} left to reach your goal
            </p>
            <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
              {getMotivationalMessage()}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default LogInCard;
