"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <Card className="w-full overflow-hidden gradient-bg2 shadow-md rounded-xl border border-color-100">
      <div className="flex flex-col items-center justify-center p-4 space-y-4 sm:p-6 sm:flex-row sm:space-y-0 sm:space-x-6 md:p-8">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <Skeleton className="h-5 w-36 sm:h-6 sm:w-48" />
              <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
            </div>
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-color-300">
              <ClockIcon
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                Hours Studied Today
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-600 dark:text-white">
                {displayText}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
