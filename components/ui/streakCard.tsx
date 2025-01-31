"use client";

import { Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  className?: string;
}

export default function StreakCard({ className }: StreakCardProps) {
  const { data: session } = useSession();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = () => {
      if (!session?.user) return 0;

      const loginHistory = localStorage.getItem(
        `loginHistory-${session.user.id}`
      );
      const logins = loginHistory ? JSON.parse(loginHistory) : [];

      const today = new Date().toISOString().split("T")[0];

      // Sort logins in descending order
      const sortedLogins = logins.sort(
        (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()
      );

      // If no logins or not logged in today, reset streak
      if (!logins.includes(today)) {
        const updatedLogins = [...logins, today].slice(-30); // Keep last 30 days
        localStorage.setItem(
          `loginHistory-${session.user.id}`,
          JSON.stringify(updatedLogins)
        );
        return 0;
      }

      // Calculate consecutive days
      let currentStreak = 1;
      for (let i = 1; i < sortedLogins.length; i++) {
        const prevDate = new Date(sortedLogins[i - 1]);
        const currentDate = new Date(sortedLogins[i]);

        const dayDifference =
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

        if (dayDifference <= 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      return currentStreak;
    };

    if (session?.user) {
      const newStreak = calculateStreak();
      setStreak(newStreak);
    }
  }, [session]);

  if (!session?.user) return null;

  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento transition duration-300 shadow-input dark:shadow-xl p-6 dark:bg-black dark:border-transparent bg-white border border-b-slate-50 justify-between flex flex-col space-y-4 h-full",
        "hover:shadow-2xl hover:scale-[1.02] hover:bg-orange-50 dark:hover:bg-orange-950",
        "dark:hover:shadow-orange-500/20",
        className
      )}
    >
      <div className="group-hover/bento:translate-x-2 transition duration-200 space-y-4">
        <div className="flex items-center space-x-2">
          <Flame className="h-6 w-6 text-orange-500 group-hover/bento:animate-pulse" />
          <h3 className="font-sans font-bold text-neutral-600 dark:text-neutral-200 group-hover/bento:text-orange-600 dark:group-hover/bento:text-orange-400">
            Your Login Streak
          </h3>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 group-hover/bento:text-orange-600 dark:group-hover/bento:text-orange-400">
            {streak}
          </span>
          <span className="text-2xl font-semibold text-neutral-500 dark:text-neutral-400 group-hover/bento:text-orange-500 dark:group-hover/bento:text-orange-300">
            days
          </span>
        </div>
        <p className="font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300 group-hover/bento:text-orange-700 dark:group-hover/bento:text-orange-200">
          Keep it up! Log in daily to increase your streak.
        </p>
      </div>
    </div>
  );
}
