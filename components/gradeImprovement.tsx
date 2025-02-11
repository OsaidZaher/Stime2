"use client";

import useSWR from "swr";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type { Subject, UserGrade } from "@prisma/client";

type SubjectWithGrades = Subject & {
  userGrades: UserGrade[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GradeChanges = () => {
  const { data, error, isLoading } = useSWR<{ subjects: SubjectWithGrades[] }>(
    "/api/functionality/grade",
    fetcher
  );

  const subjects = data?.subjects || [];

  const getLatestGrades = (userGrades: UserGrade[]) => {
    const sortedGrades = [...userGrades].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (sortedGrades.length < 2) return null;

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-[550px] h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Recent Grade Changes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {subjects.map((subject, index) => {
            const gradeChange = getLatestGrades(subject.userGrades);
            if (!gradeChange) return null;

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
                {index < subjects.length - 1 && (
                  <hr className="border-t border-gray-200" />
                )}
              </React.Fragment>
            );
          })}
          {subjects.length === 0 && (
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
