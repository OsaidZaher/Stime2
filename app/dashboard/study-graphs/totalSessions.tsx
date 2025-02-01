"use client";

import { useState } from "react";
import { CalendarDays, Clock, Calendar, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudySessionsStatsProps {
  weekSessions: number;
  monthSessions: number;
  yearSessions: number;
  weekAverage: string;
  monthAverage: string;
  yearAverage: string;
}

export function StudySessionsStats({
  weekSessions,
  monthSessions,
  yearSessions,
  weekAverage,
  monthAverage,
  yearAverage,
}: StudySessionsStatsProps) {
  const [showAverage, setShowAverage] = useState(false);

  const toggleView = () => {
    setShowAverage(!showAverage);
  };

  return (
    <Card className="w-full max-w-md h-[250px] mx-auto mt-[-270px]">
      <CardHeader className="flex flex-row items-center justify-between  pb-4">
        <div className="space-y-2">
          <CardTitle>
            {showAverage
              ? "Average Study Session Length"
              : "Total Study Sessions"}
          </CardTitle>
          <CardDescription>
            {showAverage
              ? "See how long each session is on average"
              : "See how many sessions you had"}
          </CardDescription>
        </div>
        <Button size="icon" onClick={toggleView}>
          <RotateCcw className="h-2 w-2" />
          <span className="sr-only">Toggle view</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          <div className="flex items-center space-x-4">
            <CalendarDays className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Week
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? weekAverage : weekSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Month
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? monthAverage : monthSessions}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                This Year
              </p>
              <p className="text-3xl font-bold">
                {showAverage ? yearAverage : yearSessions}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const sampleGrades = [
  { subject: "Mathematics", grade: "A" },
  { subject: "Science", grade: "B+" },
  { subject: "History", grade: 85 },
  { subject: "English", grade: "A-" },
  { subject: "Physical Education", grade: 92 },
];

function getGradeColor(grade: number | string): string {
  if (typeof grade === "number") {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  } else {
    const letterGrade = grade.charAt(0).toUpperCase();
    switch (letterGrade) {
      case "A":
        return "text-green-600";
      case "B":
        return "text-blue-600";
      case "C":
        return "text-yellow-600";
      case "D":
        return "text-orange-600";
      default:
        return "text-red-600";
    }
  }
}

export function GradeCard() {
  return (
    <Card className="w-full max-w-md h-[450px] mx-auto flex flex-col mt-[20px] ">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
        <CardTitle className="text-white text-2xl font-bold">
          Subject Grades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ul className="space-y-4">
          {sampleGrades.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
            >
              <span className="text-lg font-medium text-gray-700">
                {entry.subject}
              </span>
              <span
                className={`text-lg font-bold ${getGradeColor(entry.grade)}`}
              >
                {entry.grade}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

export function StudyGoalCard() {
  const currentProgress = 10;
  const goal = 20;
  const percentage = Math.min(Math.round((currentProgress / goal) * 100), 100);
  const remainingPercentage = 100 - percentage;

  return (
    <Card className="w-full max-w-md h-[250px] mx-auto mt-[-270px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Study Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              Current Progress
            </p>
            <p className="text-xl font-bold">
              {currentProgress} / {goal} hours
            </p>
          </div>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-center text-lg font-semibold">
          You are <span className="text-blue-500">{remainingPercentage}%</span>{" "}
          away from achieving your study goal!
        </p>
      </CardContent>
    </Card>
  );
}
