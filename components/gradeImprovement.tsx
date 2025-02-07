"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Subject, UserGrade } from "@prisma/client";

type SubjectWithGrades = Subject & {
  userGrades: UserGrade[];
};

const GradeChanges = () => {
  const [subjects, setSubjects] = useState<SubjectWithGrades[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch("/api/functionality/grade");
        if (!response.ok) {
          throw new Error("Failed to fetch grades");
        }
        const data = await response.json();
        setSubjects(data.subjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load grades");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getLatestGrades = (userGrades: UserGrade[]) => {
    if (userGrades.length < 2) return null;

    const sortedGrades = [...userGrades].sort(
      (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()
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
      const percentageIncrease = ((newValue - oldValue) / oldValue) * 100;
      return (
        <div className="flex items-center space-x-1">
          <span className="text-lg font-semibold">{newValue}%</span>
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500">
            +{percentageIncrease.toFixed(1)}%
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{oldGrade}</span>
          <ArrowRight className="h-4 w-4 text-blue-500" />
          <span className="text-lg font-semibold">{newGrade}</span>
        </div>
      );
    }
  };

  return (
    <Card className="w-[550px] h-[400px]  ">
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
                    {subject.name}
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
