import { Card } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import { StudySession } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function DashTimeCard() {
  const [todayStudy, setTodayStudy] = useState<Number>(0);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR(
    "/api/functionality/studySession",
    fetcher
  );

  useEffect(() => {
    if (!data) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = data.filter((session: StudySession) => {
      const SessionCreation = new Date(session.startTime);
      return SessionCreation >= today;
    });

    const totalTime = +(
      todaySessions.reduce(
        (total: number, session: StudySession) => total + session.duration,
        0
      ) / 60
    ).toFixed(1);
    setTodayStudy(totalTime);
  }, [data]);

  return (
    <Card className=" overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 p-4 shadow-md h-[155px] dark:bg-gradient-to-r dark:from-blue-700 dark:to-blue-950">
      <div className=" flex items-center gap-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 mt-[15px] dark:bg-blue-400">
          <ClockIcon className="h-12 w-12 text-white " strokeWidth={2} />
        </div>
        <div className="flex flex-col mt-4 space-y-4">
          <span className="text-xl font-bold text-black text-center dark:text-white">
            Hours Studied Today
          </span>

          <span className="text-4xl font-bold theme-text text-center dark:text-blue-200">
            {isLoading ? "..." : `${todayStudy}hrs`}
          </span>
        </div>
      </div>
    </Card>
  );
}
