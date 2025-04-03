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

  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    subject: "",
    target: 0,
  });

  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState({
    id: "",
    subject: "",
    target: 0,
  });

  const addStudyGoal = async () => {
    if (!newGoal.subject || newGoal.target <= 0) {
      toast.error("Please enter a subject name and a valid target hours");
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectGoals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newGoal.subject,
          target: Number(newGoal.target),
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add subject goal");
      }

      setNewGoal({ subject: "", target: 0 });
      setNewGoalOpen(false);
      mutate();
      toast.success("Subject goal added successfully!");
    } catch (error) {
      console.error("Error adding subject goal:", error);
      toast.error("Failed to add subject goal");
    }
  };

  const updateStudyGoal = async () => {
    if (!editGoal.subject || editGoal.target <= 0) {
      toast.error("Please enter a subject name and a valid target hours");
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectGoals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editGoal.id,
          subject: editGoal.subject,
          target: Number(editGoal.target),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subject goal");
      }

      setEditGoal({ id: "", subject: "", target: 0 });
      setEditGoalOpen(false);
      mutate();
      toast.success("Subject goal updated successfully!");
    } catch (error) {
      console.error("Error editing subject goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update subject goal"
      );
    }
  };

  const deleteStudyGoal = async (subjectGoalId: string) => {
    try {
      const response = await fetch("/api/functionality/subjectGoals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectGoalId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete subject goal");
      }

      toast.success("Subject goal deleted successfully");
      mutate();
    } catch (error) {
      console.error("Error deleting subject goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete subject goal"
      );
    }
  };

  const handleEditGoal = (goal: SubjectGoalWithSubject) => {
    setEditGoal({
      id: goal.id,
      subject: goal.subject.name,
      target: goal.target,
    });
    setEditGoalOpen(true);
  };

  const secondsToHours = (seconds: number): number => {
    return parseFloat((seconds / 3600).toFixed(2));
  };

  const calculatePercentage = (
    completionSeconds: number,
    targetHours: number
  ): number => {
    const completionHours = secondsToHours(completionSeconds);
    return parseFloat(((completionHours / targetHours) * 100).toFixed(1));
  };

  // Add a loading state
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Study Goals</CardTitle>
          <CardDescription>Your weekly study hour targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p>Loading your study goals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Study Goals</CardTitle>
          <CardDescription>Your weekly study hour targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p>Error loading study goals. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Study Goals</CardTitle>
          <CardDescription>Your weekly study hour targets</CardDescription>
        </div>
        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Study Goal</DialogTitle>
              <DialogDescription>
                Set a new weekly study hour target for a subject.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Mathematics"
                  value={newGoal.subject}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, subject: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Target Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={newGoal.target || ""}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      target: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addStudyGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Study Goal</DialogTitle>
              <DialogDescription>
                Update your weekly study hour target.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="edit-subject"
                  placeholder="e.g. Mathematics"
                  value={editGoal.subject}
                  onChange={(e) =>
                    setEditGoal({ ...editGoal, subject: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-hours">Target Hours</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  min="1"
                  value={editGoal.target || ""}
                  onChange={(e) =>
                    setEditGoal({
                      ...editGoal,
                      target: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateStudyGoal}>Update Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {data?.subjectGoals && data.subjectGoals.length > 0 ? (
            data.subjectGoals.map((goal) => {
              const completionHours = secondsToHours(goal.completion);
              const percentage = calculatePercentage(
                goal.completion,
                goal.target
              );

              return (
                <div
                  key={goal.id}
                  className="space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-10 bg-blue-500 rounded-full mr-3`}
                      ></div>
                      <div>
                        <h4 className="font-medium">{goal.subject.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {completionHours}/{goal.target} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">{percentage}%</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteStudyGoal(goal.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2.5 rounded-full"
                    indicatorClassName="bg-blue-500 rounded-full"
                  />
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground mb-4">
                No study goals set yet
              </p>
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => setNewGoalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create your first goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
