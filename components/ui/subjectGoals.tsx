"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Pencil, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import type { Subject, SubjectGoal } from "@prisma/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SubjectGoalWithSubject extends SubjectGoal {
  subject: Subject;
}

interface ApiResponse {
  subjectGoals: SubjectGoalWithSubject[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubjectGoalsCard() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    "/api/functionality/subjectGoals",
    fetcher
  );

  const [addOpen, setAddOpen] = useState(false);
  const [addSubject, setAddSubject] = useState("");
  const [addTarget, setAddTarget] = useState<number>(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editTarget, setEditTarget] = useState<number>(0);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addSubject || addTarget <= 0) {
      toast.error("Please enter a subject name and a valid target hours");
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectGoals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: addSubject,
          target: Number(addTarget),
          isCompleted: false,
          completion: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add subject goal");
      }

      setAddSubject("");
      setAddTarget(0);
      setAddOpen(false);
      mutate();
      toast.success("Subject goal added successfully!");
    } catch (error) {
      console.error("Error adding subject goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add subject goal"
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSubject || editTarget <= 0) {
      toast.error("Please enter a subject name and a valid target hours");
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectGoals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: editSubject,
          target: Number(editTarget),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subject goal");
      }

      setEditSubject("");
      setEditTarget(0);
      setEditOpen(false);
      mutate();
      toast.success("Subject goal updated successfully!");
    } catch (error) {
      console.error("Error editing subject goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update subject goal"
      );
    }
  };

  const subjectGoals = data?.subjectGoals ?? [];

  return (
    <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Subjects Progress
        </CardTitle>
        <div className="flex gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Edit Subject Goal
                </DialogTitle>
                <DialogDescription>
                  Adjust your study target for better time management.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-subject">Subject</Label>
                    <Input
                      id="edit-subject"
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-target">Target Hours</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(Number(e.target.value))}
                      min="1"
                      placeholder="e.g., 10"
                      className="w-full"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Update Goal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Add New Subject Goal
                </DialogTitle>
                <DialogDescription>
                  Set a study target for a new subject to track your progress.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-subject">Subject</Label>
                    <Input
                      id="add-subject"
                      type="text"
                      value={addSubject}
                      onChange={(e) => setAddSubject(e.target.value)}
                      placeholder="e.g., Physics"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-target">Target Hours</Label>
                    <Input
                      id="add-target"
                      type="number"
                      value={addTarget}
                      onChange={(e) => setAddTarget(Number(e.target.value))}
                      min="1"
                      placeholder="e.g., 20"
                      className="w-full"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Add Goal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 pt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">
            Error loading subject goals.
          </p>
        ) : subjectGoals.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No subject goals added yet.
          </p>
        ) : (
          subjectGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium">
                    {goal.subject.name.charAt(0).toUpperCase() +
                      goal.subject.name.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {((goal.completion / (goal.target * 60)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(goal.completion / (goal.target * 60)) * 100}
                className="h-2 [&>div]:bg-blue-400"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(goal.completion / 60)} hrs</span>
                <span>{goal.target} hrs</span>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
