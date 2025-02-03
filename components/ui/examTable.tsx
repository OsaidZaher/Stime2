"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exam } from "@prisma/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

const EXAM_PER_CARD = 5;

export function ExamTable({ refreshTrigger }: { refreshTrigger?: number }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/functionality/calendar");
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [refreshTrigger]);

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

    calculateTimeLeft();

    // Update countdowns every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [exams]);

  const handleDeleteExam = async (examId: Exam["id"]) => {
    try {
      const response = await fetch("/api/functionality/calendar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete exam");
      }

      const updatedExams = exams.filter((exam) => exam.id !== examId);
      setExams(updatedExams);

      const totalPages = Math.ceil(updatedExams.length / EXAM_PER_CARD);
      if (currentPage >= totalPages) {
        setCurrentPage(Math.max(0, totalPages - 1));
      }

      console.log("Exam deleted successfully");
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  const totalPages = Math.ceil(exams.length / EXAM_PER_CARD);

  const currentExams = exams
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(currentPage * EXAM_PER_CARD, (currentPage + 1) * EXAM_PER_CARD);

  const handleNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card className="h-[350px] w-[550px] relative">
      <CardHeader className="pb-0">
        <CardTitle>Exam Countdown</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700 py-2 dark:text-slate-100  ">
        {loading
          ? "Loading table..."
          : exams.length === 0
          ? "You have no exams coming up!"
          : "Stay focused on your upcoming exams! "}
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
          {currentExams.map((exam) => (
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
              <TableCell>
                {countdowns[exam.id]}{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 absolute right-1"
                  onClick={() => handleDeleteExam(exam.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {/* Padding rows to maintain consistent card height */}
          {currentExams.length < EXAM_PER_CARD &&
            Array.from({ length: EXAM_PER_CARD - currentExams.length }).map(
              (_, index) => (
                <TableRow key={`empty-${index}`}>
                  <TableCell colSpan={3}>&nbsp;</TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
      {exams.length > EXAM_PER_CARD && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation("left")}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation("right")}
            disabled={currentPage >= totalPages - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
