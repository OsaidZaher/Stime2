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

const max = 5;

type subjectGrade = Subject & { userGrades: UserGrade[] };

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GradeChanges() {
  const { data, error, isLoading } = useSWR<{ subjects: subjectGrade[] }>(
    "endpoint",
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(0);

  const validSubjects =
    data?.subjects.filter((subject) => subject.userGrades.length >= 2) || [];

  const totalPages = Math.ceil(validSubjects.length / max);

  useEffect(() => {
    if (totalPages > 0 && totalPages >= currentPage)
      setCurrentPage(totalPages - 1);
  });

  const currentGrades = validSubjects.slice(
    currentPage * max,
    currentPage + 1 * max
  );
  const handleNavigation = (directions: "left" | "right") => {
    if (directions === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (directions === "right" && currentPage < totalPages - 1)
      setCurrentPage(currentPage + 1);
  };

  const Grade = (grade: string) => {
    return grade.charAt(0) + grade.slice(1);
  };

  const getLatestGrades = (userGrades: UserGrade[]) => {
    const sortedGrades = [...userGrades].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const oldGrade = sortedGrades[0].grades[0];
    const newGrade = sortedGrades[1].grades[0];
    return { oldGrade, newGrade };
  };
}
