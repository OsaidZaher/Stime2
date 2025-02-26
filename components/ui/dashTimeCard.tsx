"use client";

import { Card } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import type { StudySession } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function DashTimeCard() {
  const [todayStudy, setTodayStudy] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>("0 mins");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<StudySession[]>(
    "/api/functionality/studySession",
    fetcher
  );

  useEffect(() => {
    if (!data) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = data.filter((session) => {
      const sessionCreation = new Date(session.startTime);
      return sessionCreation >= today;
    });

    const totalMinutes = Math.floor(
      todaySessions.reduce((total, session) => total + session.duration, 0) / 60
    );

    setTodayStudy(totalMinutes);

    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMins = totalMinutes % 60;

      if (remainingMins === 0) {
        setDisplayText(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
      } else {
        setDisplayText(
          `${hours} ${hours === 1 ? "hr" : "hrs"} ${remainingMins} mins`
        );
      }
    } else {
      setDisplayText(`${totalMinutes} mins`);
    }
  }, [data]);

  return (
    <Card className="overflow-hidden gradient-bg2 shadow-md rounded-xl border border-color-100">
      <div className="flex flex-col items-center justify-center p-6 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-color-300">
          <ClockIcon className="h-10 w-10 text-white" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Hours Studied Today
          </span>
          <span className="text-4xl font-bold text-600 dark:text-white">
            {isLoading ? "..." : displayText}
          </span>
        </div>
      </div>
    </Card>
  );
}
