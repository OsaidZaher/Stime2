"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exam } from "@prisma/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface StudySession {
  id: string;
  duration: number;
  topic: string;
  subject: {
    name: string;
  };
  startTime: string;
}

interface SubjectTime {
  name: string;
  totalDuration: number;
}

export function ExamTable() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/functionality/calendar");
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newCountdowns: { [key: string]: string } = {};

      exams.forEach((exam) => {
        const examDate = new Date(exam.date);
        const now = new Date();
        const difference = examDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );

          if (days > 0) {
            newCountdowns[exam.id] = `${days} days, ${hours} hours`;
          } else if (hours > 0) {
            newCountdowns[exam.id] = `${hours} hours, ${minutes} minutes`;
          } else {
            newCountdowns[exam.id] = `${minutes} minutes`;
          }
        } else {
          newCountdowns[exam.id] = "Exam has passed";
        }
      });

      setCountdowns(newCountdowns);
    };

    // Calculate initial countdowns
    calculateTimeLeft();

    // Update countdowns every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [exams]);

  return (
    <Card className="h-[350px] w-[550px]">
      <CardHeader className="pb-0">
        <CardTitle>Exam Countdown</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700 py-2">
        Press on the row to edit.
      </CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Exam Name</TableHead>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead>Time Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.name}</TableCell>
                <TableCell>
                  {new Date(exam.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{countdowns[exam.id]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
