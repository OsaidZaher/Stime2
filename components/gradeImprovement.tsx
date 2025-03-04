"use client";

import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Subject, UserGrade } from "@prisma/client";
import { Button } from "@/components/ui/button";

const MAX_PER_CARD = 5;

type SubjectWithGrades = Subject & {
  userGrades: UserGrade[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GradeChanges = () => {
  const { data, error, isLoading } = useSWR<{ subjects: SubjectWithGrades[] }>(
    "/api/functionality/grade",
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(0);

  const validSubjects =
    data?.subjects.filter((subject) => subject.userGrades.length >= 2) || [];

  const totalPages = Math.ceil(validSubjects.length / MAX_PER_CARD);

  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [validSubjects, currentPage, totalPages]);

  const getLatestGrades = (userGrades: UserGrade[]) => {
    const sortedGrades = [...userGrades].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const newGrade = sortedGrades[0].grades[0];
    const oldGrade = sortedGrades[1].grades[0];

    return { oldGrade, newGrade };
  };

  const renderGradeChange = (oldGrade: string, newGrade: string) => {
    const isNumeric = (value: string) => !isNaN(Number(value));

    if (isNumeric(oldGrade) && isNumeric(newGrade)) {
      const oldValue = Number(oldGrade);
      const newValue = Number(newGrade);
      const percentageChange = newValue - oldValue;
      const isIncrease = percentageChange > 0;

      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{newValue}%</span>
          {isIncrease ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`text-sm ${
              isIncrease ? "text-green-500" : "text-red-500"
            }`}
          >
            {isIncrease ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold">{oldGrade}</span>
        <ArrowRight className="h-5 w-5 text-blue-500" />
        <span className="text-lg font-semibold">{newGrade}</span>
      </div>
    );
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Get subjects for current page
  const currentSubjects = validSubjects.slice(
    currentPage * MAX_PER_CARD,
    (currentPage + 1) * MAX_PER_CARD
  );

  const handleNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-[550px] h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          Recent Grade Changes
          {validSubjects.length > MAX_PER_CARD && (
            <div className="flex  text-500 items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation("left")}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation("right")}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {currentSubjects.length > 0 ? (
            currentSubjects.map((subject, index) => {
              const gradeChange = getLatestGrades(subject.userGrades);

              return (
                <React.Fragment key={subject.id}>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      {capitalizeFirstLetter(subject.name)}
                    </span>
                    {renderGradeChange(
                      gradeChange.oldGrade,
                      gradeChange.newGrade
                    )}
                  </div>
                  {index < currentSubjects.length - 1 && (
                    <hr className="border-t border-gray-200" />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="text-center text-gray-500">
              No grade changes found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeChanges;
