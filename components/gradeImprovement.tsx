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
import { Skeleton } from "@/components/ui/skeleton";

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
        <ArrowRight className="h-5 w-5 text-500" />
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

  // Skeleton component for the grade changes
  const GradeChangesSkeleton = () => (
    <Card className="max-w-xl h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array(MAX_PER_CARD)
            .fill(0)
            .map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex justify-between items-center py-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                {index < MAX_PER_CARD - 1 && (
                  <hr className="border-t border-gray-200" />
                )}
              </React.Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <GradeChangesSkeleton />;
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-full max-w-xl h-auto sm:h-[400px] shadow-md rounded-xl overflow-hidden border border-color-100">
      <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-bold">
            Recent Grade Changes
          </CardTitle>
          {validSubjects.length > MAX_PER_CARD && (
            <div className="flex text-500 items-center space-x-1 sm:space-x-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                onClick={() => handleNavigation("left")}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm text-gray-500">
                {currentPage + 1}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                onClick={() => handleNavigation("right")}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 py-2 sm:py-4">
        <div className="space-y-1 sm:space-y-2">
          {currentSubjects.length > 0 ? (
            currentSubjects.map((subject, index) => {
              const gradeChange = getLatestGrades(subject.userGrades);

              return (
                <React.Fragment key={subject.id}>
                  <div className="flex justify-between items-center py-1 sm:py-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 truncate max-w-[60%]">
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
            <div className="text-center text-xs sm:text-sm text-gray-500 py-4">
              No grade changes found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeChanges;
