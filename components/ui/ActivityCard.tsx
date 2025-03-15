"use client";

import { StudySession } from "@prisma/client";
import { Exam } from "@prisma/client";
import useSWR from "swr";

import { useState } from "react";
import { Plus, Calendar, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ActivityCard() {
  const {
    data: studySessionData,
    error: studySessionError,
    isLoading: studySessionLoading,
    mutate: studySessionMutate,
  } = useSWR<StudySession[]>("/api/functionality/studySession", fetcher);

  const {
    data: calendarData,
    error: calendarError,
    isLoading: calendarLoading,
    mutate: calendarMutate,
  } = useSWR<Exam[]>("/api/functionality/calendar", fetcher);

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-0">
        <Tabs defaultValue="activity" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-lg font-semibold">
              Recent Study Sessions
            </CardTitle>
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="activity" className="m-0">
            <div className="space-y-4 mt-2">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${activity.iconBg} ${activity.iconColor} p-2 rounded-full`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="m-0">
            <div className="flex justify-center items-center p-6 min-h-[200px]">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Your Schedule</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No upcoming events for today
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
