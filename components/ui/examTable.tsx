"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Exam } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAM_PER_CARD = 4;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ExamTable() {
  const {
    data: exams,
    error,
    isLoading,
    mutate,
  } = useSWR<Exam[]>("/api/functionality/calendar", fetcher);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!exams) return;

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

      mutate();
      console.log("Exam deleted successfully");
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  if (error) return <div>Error loading exams.</div>;
  if (!exams) return null;

  const totalPages = Math.ceil(exams.length / EXAM_PER_CARD);
  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const currentExams = sortedExams.slice(
    currentPage * EXAM_PER_CARD,
    (currentPage + 1) * EXAM_PER_CARD
  );

  const handleNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Exams</CardTitle>
      </CardHeader>
      <CardContent className="h-60 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Countdown</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentExams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>
                  {new Date(exam.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{countdowns[exam.id]}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    <X size={12} className="text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {[...Array(EXAM_PER_CARD - currentExams.length)].map((_, index) => (
              <TableRow key={`empty-${index}`} className="h-12">
                <TableCell colSpan={4}>&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 0}
          onClick={() => handleNavigation("left")}
        >
          <ChevronLeft size={16} className="text-blue-700 font-extrabold" />
        </Button>
        <span className="text-sm text-muted-foreground ">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages - 1}
          onClick={() => handleNavigation("right")}
        >
          <ChevronRight size={16} className="text-blue-700 font-extrabold" />
        </Button>
      </CardFooter>
    </Card>
  );
}
