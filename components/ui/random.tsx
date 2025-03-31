"use client";

import { useState } from "react";
import { X, Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import type { Subject, SubjectGoal } from "@prisma/client";
import { Subjects } from "react-hook-form";

interface SubjectGoalWithSubject extends SubjectGoal {
  subject: Subjects;
}

interface ApiResponse {
  subjectGoals: SubjectGoalWithSubject[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubjectGoalsCard() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>("", fetcher);

  const [newGoal, setNewGoal] = useState({
    target: 0,
    subject: "",
  });

  const [editGoal, setEditGoal] = useState({
    id: "",
    subject: "",
    target: 0,
  });

  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [editGoalOpen, setEditGoalOpen] = useState(false);

  const addSubjectGoal = async (params: Request) => {
    if (!newGoal.subject || !newGoal.target) {
      toast.error("you need to add fileds");
    }

    try {
    } catch (error) {
      console.error("found this error:", error);
    }
  };
}
