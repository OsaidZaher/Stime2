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
      const response = await fetch("", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subject: newGoal.subject,
          target: Number(newGoal.target),
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "failed to add subject");
      }

      setNewGoal({
        subject: "",
        target: 0,
      });
      setNewGoalOpen(false);
      mutate();
      toast.success("new goal added successfully");
    } catch (error) {
      console.error("found this error:", error);
      toast.error("Failed to add subject goal");
    }
  };
  const updateStudyGoal = async (params: Request) => {
    try {
      if (!newGoal.target || !newGoal.subject) {
        toast.error(" you gotta add them fields dawg");
      }

      const response = await fetch("", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: editGoal.id,
          subject: editGoal.subject,
          target: Number(editGoal.target),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "this is the error you got when updating goals",
          errorData.error
        );
      }
      setEditGoal({
        target: 0,
        subject: "",
        id: "",
      });
      setEditGoalOpen(false);
      mutate();
    } catch (error) {
      console.log("this is the error", error);
      toast.error(error instanceof Error || "failed to update subject");
    }
  };

  const deleteStudyGoal = async (subjectGoalId: string) => {
    try {
      const response = await fetch("", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subjectGoalId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
      }
      toast.success("you have deleted this successfully");
    } catch (error) {
      console.error("found errror", error);
      toast.error(error instanceof Error || "failed to delete subject");
    }
  };

  const [newToDo, setNewToDo] = useState({
    task: "",
    priority: "",
    isCompleted: false,
    dueDate: Date,
  });

  const [editedToDo, setEditedToDo] = useState({
    id: "",
    editedTask: "",
    editedPriority: "",
    isCompleted: false,
    editedDueDate: Date,
  });
}
