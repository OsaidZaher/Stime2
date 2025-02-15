"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { Subject, SubjectGoal } from "@prisma/client";

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
      alert("Please enter a subject name and a valid target hours");
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
    } catch (error) {
      console.error("Error adding subject goal:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add subject goal"
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSubject || editTarget <= 0) {
      alert("Please enter a subject name and a valid target hours");
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
    } catch (error) {
      console.error("Error editing subject goal:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update subject goal"
      );
    }
  };

  const subjectGoals = data?.subjectGoals ?? [];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl">Subjects Progress</CardTitle>
        <div className="flex gap-2">
          {/* Edit Subject Goal Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit your Subject Goal</DialogTitle>
                <DialogDescription>
                  Want to change the amount of time you want to study?
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <Label>Enter Subject</Label>
                    <Input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="Subject name"
                      className="w-40 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>New Hours</Label>
                    <Input
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(Number(e.target.value))}
                      min="1"
                      placeholder="Target hours"
                      className="w-20 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Update Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Subject Goal Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Subject Goal</DialogTitle>
                <DialogDescription>
                  Add the amount of hours you want to study for the subject!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <Label>Subject</Label>
                    <Input
                      type="text"
                      value={addSubject}
                      onChange={(e) => setAddSubject(e.target.value)}
                      placeholder="Subject name"
                      className="w-40 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      value={addTarget}
                      onChange={(e) => setAddTarget(Number(e.target.value))}
                      min="1"
                      placeholder="Target hours"
                      className="w-20 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading subject goals.</p>
        ) : subjectGoals.length === 0 ? (
          <p>No subject goals added yet.</p>
        ) : (
          subjectGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm">{goal.subject.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress
                  value={(goal.completion / goal.target) * 100}
                  className="h-2"
                />
                <span className="text-xs">
                  {((goal.completion / goal.target) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
