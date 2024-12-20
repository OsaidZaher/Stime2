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
        const data: StudySession[] = await response.json();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const recentSessions = data.filter((session: StudySession) => {
          const sessionDate = new Date(session.startTime);
          return sessionDate >= startOfMonth && sessionDate < endOfMonth;
        });

        const subjectTotals: Record<string, number> = recentSessions.reduce(
          (acc: Record<string, number>, session: StudySession) => {
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
  const [thisMonthTotal, setThisMonthTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/functionality/studySession");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: StudySession[] = await response.json();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const thisMonthSessions = data.filter(
          (session: StudySession) => new Date(session.startTime) >= startOfMonth
        );

        const thisMonthHours = thisMonthSessions.reduce(
          (total: number, session: StudySession) =>
            total + session.duration / 3600,
          0
        );

        setThisMonthTotal(Number(thisMonthHours.toFixed(2)));
      } catch (error) {
        console.error("Error fetching study sessions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-8xl text-center mt-16">
      {thisMonthTotal}
    </h1>
  );
}
