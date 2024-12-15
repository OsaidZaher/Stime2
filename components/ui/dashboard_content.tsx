"use client";

import React, { useState, useEffect } from "react";

interface StudySession {
  startTime: string;
  duration: number;
  subject: {
    name: string;
  };
}

export function SubjectContent() {
  const [mostStudiedSubject, setMostStudiedSubject] =
    useState<string>("None yet!");

  useEffect(() => {
    const fetchMostStudiedSubject = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        const data = await response.json();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentSessions = data.filter((session: any) => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= sevenDaysAgo;
        });

        const subjectTotals: Record<string, number> = recentSessions.reduce(
          (acc: Record<string, number>, session: any) => {
            const { subject, duration } = session;
            if (!acc[subject.name]) {
              acc[subject.name] = 0;
            }
            acc[subject.name] += duration;
            return acc;
          },
          {}
        );

        const mostStudied =
          Object.entries(subjectTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([subject]) => subject)[0] || "None yet!";

        setMostStudiedSubject(mostStudied);
      } catch (error) {
        console.error("Error fetching most studied subject:", error);
        setMostStudiedSubject("Error fetching subject");
      }
    };

    fetchMostStudiedSubject();
  }, []);

  return (
    <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-8xl text-center mt-16">
      {mostStudiedSubject}
    </h1>
  );
}

export function HoursStudyContent() {
  const [thisWeekTotal, setThisWeekTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StudySession[] = await response.json();

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeekSessions = data.filter(
          (session) => new Date(session.startTime) >= oneWeekAgo
        );

        const thisWeekHours = thisWeekSessions.reduce(
          (total, session) => total + session.duration / 3600,
          0
        );

        setThisWeekTotal(Number(thisWeekHours.toFixed(2)));
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-8xl text-center mt-16">
      {thisWeekTotal}
    </h1>
  );
}
