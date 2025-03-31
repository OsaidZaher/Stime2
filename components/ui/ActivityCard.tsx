"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, ChevronRight, BookOpen } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Calculate duration string from seconds
function calculateDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  let durationString = "";

  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    durationString += `${minutes}m `;
  }
  durationString += `${seconds}s`;

  return durationString;
}

// Format date to a readable string
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString() +
    " at " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

// API fetchers
const studySessionFetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch study sessions");
    }

    const data = await res.json();
    return data.map((session: any) => ({
      id: session.id,
      subjectName: session.subject.name,
      topic: session.topic,
      duration: calculateDuration(session.duration),
      startTime: session.startTime,
    }));
  });
const examFetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ActivityCard() {
  // Fetch study sessions
  const {
    data: studySessions,
    error: sessionsError,
    isLoading: sessionsLoading,
  } = useSWR("/api/functionality/studySession", studySessionFetcher);

  // Fetch exams
  const {
    data: exams,
    error: examsError,
    isLoading: examsLoading,
  } = useSWR("/api/functionality/calendar", examFetcher);

  // Calculate countdowns for exams
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!exams) return;

    const calculateTimeLeft = () => {
      const newCountdowns: { [key: string]: string } = {};

      exams.forEach((exam: any) => {
        const examDate = new Date(exam.date);
        const now = new Date();
        const difference = examDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );

          if (days > 0) {
            newCountdowns[exam.id] = `${days} day${days !== 1 ? "s" : ""} left`;
          } else {
            newCountdowns[exam.id] = `${hours} hour${
              hours !== 1 ? "s" : ""
            } left`;
          }
        } else {
          newCountdowns[exam.id] = "Past due";
        }
      });

      setCountdowns(newCountdowns);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [exams]);

  // Get exactly 4 most recent study sessions
  const recentSessions = studySessions
    ? [...studySessions]
        .sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )
        .slice(0, 4)
    : [];

  // Get exactly 4 upcoming exams (sort by date)
  const upcomingExams = exams
    ? [...exams]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter((exam) => new Date(exam.date) > new Date())
        .slice(0, 4)
    : [];

  return (
    <Card className="border-none shadow-md h-96">
      <CardHeader className="pb-0">
        <Tabs defaultValue="activity" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="activity" className="m-0">
            <div className="space-y-3 mt-2 h-72 overflow-y-auto">
              {sessionsLoading ? (
                // Skeleton loading state - exactly 4 items
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))
              ) : sessionsError ? (
                <div className="p-4 text-center h-full flex items-center justify-center">
                  <p>Error loading study sessions</p>
                </div>
              ) : recentSessions && recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          <span className="font-semibold font 2xl:">
                            {session.subject.name.charAt(0).toUpperCase() +
                              session.subject.name.slice(1)}
                          </span>{" "}
                          - {session.topic}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.startTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 h-full flex flex-col items-center justify-center">
                  <p className="text-muted-foreground">No study sessions yet</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    Start Studying
                  </Button>
                </div>
              )}

              {/* Padding items to maintain consistent height when fewer than 4 sessions */}
              {recentSessions &&
                recentSessions.length > 0 &&
                recentSessions.length < 4 &&
                Array(4 - recentSessions.length)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`padding-${index}`}
                      className="p-3 rounded-lg invisible"
                    >
                      <div className="h-16"></div>
                    </div>
                  ))}
            </div>
            {recentSessions && recentSessions.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  View All Activity
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="m-0">
            <div className="h-64 overflow-y-auto">
              {examsLoading ? (
                // Skeleton loading state - exactly 4 items
                <div className="space-y-3 p-4">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                </div>
              ) : examsError ? (
                <div className="p-4 text-center h-full flex items-center justify-center">
                  <p>Error loading exam calendar</p>
                </div>
              ) : upcomingExams && upcomingExams.length > 0 ? (
                <div className="space-y-3 p-2">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {countdowns[exam.id]}
                      </span>
                    </div>
                  ))}

                  {/* Padding items to maintain consistent height when fewer than 4 exams */}
                  {upcomingExams.length < 4 &&
                    Array(4 - upcomingExams.length)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={`padding-${index}`}
                          className="p-3 rounded-lg invisible"
                        >
                          <div className="h-16"></div>
                        </div>
                      ))}
                </div>
              ) : (
                <div className="flex justify-center items-center p-6 h-full">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Your Schedule</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No upcoming exams
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Exam
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {upcomingExams && upcomingExams.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  View All Events
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
