"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ToDo {
  id: string;
  task: string;
  isCompleted: boolean;
  isDisplayed: boolean;
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TodoListCard() {
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState("");
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const { data, error, isLoading } = useSWR("/api/functionality/toDo", fetcher);
  const tasks: ToDo[] = data?.taskToDo || [];

  const displayedTasks = tasks.filter((task) => task.isDisplayed).slice(0, 5);

  const displayedTasksCount = tasks.filter((task) => task.isDisplayed).length;

  const hiddenTasksCount = tasks.length - displayedTasksCount;

  const completedTasks = tasks.filter((task) => task.isCompleted).length;

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newStatus = !task.isCompleted;

      // Optimistic update
      mutate(
        "/api/functionality/toDo",
        {
          taskToDo: tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: newStatus } : t
          ),
        },
        false
      );

      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          editedTask: task.task,
          isCompleted: newStatus,
          isDisplayed: task.isDisplayed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task");
      }

      mutate("/api/functionality/toDo");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task status");
      mutate("/api/functionality/toDo");
    }
  };

  const toggleTaskDisplay = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Count how many tasks are currently displayed
      const currentDisplayedCount = tasks.filter((t) => t.isDisplayed).length;
      const newDisplayStatus = !task.isDisplayed;

      // If trying to display more than 5 tasks, show warning and abort
      if (newDisplayStatus && !task.isDisplayed && currentDisplayedCount >= 5) {
        toast.error(
          "Maximum 5 tasks can be displayed. Please hide a task first."
        );
        return;
      }

      // Optimistic update
      mutate(
        "/api/functionality/toDo",
        {
          taskToDo: tasks.map((t) =>
            t.id === taskId ? { ...t, isDisplayed: newDisplayStatus } : t
          ),
        },
        false
      );

      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          editedTask: task.task,
          isCompleted: task.isCompleted,
          isDisplayed: newDisplayStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update task display status"
        );
      }

      mutate("/api/functionality/toDo");

      if (newDisplayStatus) {
        toast.success("Task added to display");
      } else {
        toast.success("Task removed from display");
      }
    } catch (error) {
      console.error("Error toggling task display:", error);
      toast.error("Failed to update task display status");
      mutate("/api/functionality/toDo");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Optimistic update
      mutate(
        "/api/functionality/toDo",
        {
          taskToDo: tasks.filter((t) => t.id !== taskId),
        },
        false
      );

      const response = await fetch("/api/functionality/toDo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete task");
      }

      mutate("/api/functionality/toDo");
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
      mutate("/api/functionality/toDo");
    }
  };

  const addTask = async () => {
    try {
      if (!newTask.trim()) {
        toast.error("Task cannot be empty");
        return;
      }

      // Determine if the new task should be displayed
      // If we have less than 5 displayed tasks, show it by default
      const shouldDisplay = displayedTasksCount < 5;

      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        id: tempId,
        task: newTask,
        isCompleted: false,
        isDisplayed: shouldDisplay,
        userId: "",
      };

      // Optimistic update
      mutate(
        "/api/functionality/toDo",
        { taskToDo: [...tasks, tempTask] },
        false
      );

      const response = await fetch("/api/functionality/toDo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: newTask,
          isCompleted: false,
          isDisplayed: shouldDisplay,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add task");
      }

      setNewTask("");
      mutate("/api/functionality/toDo");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
      mutate("/api/functionality/toDo");
    }
  };

  const handleStartEdit = (task: ToDo) => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.task);
  };

  const handleEditTask = async (taskId: string) => {
    try {
      if (!editedTaskText.trim()) {
        toast.error("Task cannot be empty");
        return;
      }

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Optimistic update
      mutate(
        "/api/functionality/toDo",
        {
          taskToDo: tasks.map((t) =>
            t.id === taskId ? { ...t, task: editedTaskText } : t
          ),
        },
        false
      );

      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          editedTask: editedTaskText,
          isCompleted: task.isCompleted,
          isDisplayed: task.isDisplayed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit task");
      }

      setEditingTaskId(null);
      mutate("/api/functionality/toDo");
    } catch (error) {
      console.error("Error editing task:", error);
      toast.error("Failed to update task");
      mutate("/api/functionality/toDo");
    }
  };

  if (error) return <div>Failed to load tasks</div>;

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {completedTasks}/{tasks.length}
            </Badge>
          </div>
        </div>
        <CardDescription>Manage your study tasks</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="border-primary/20 focus-visible:ring-primary/30"
          />
          <Button size="icon" onClick={addTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1 max-h-[280px] overflow-auto pr-1">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-2.5">
                  <div className="h-5 w-5 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                </div>
              ))
          ) : displayedTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              {tasks.length === 0
                ? "No tasks yet. Add one to get started!"
                : "No displayed tasks. Select tasks to display on the View All page."}
            </div>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-2.5 rounded-md transition-colors ${
                  task.isCompleted ? "bg-muted/50" : "hover:bg-muted/30"
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editedTaskText}
                      onChange={(e) => setEditedTaskText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEditTask(task.id)
                      }
                      autoFocus
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={() => handleEditTask(task.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full"
                    >
                      <CheckCircle2
                        className={`h-5 w-5 transition-colors ${
                          task.isCompleted
                            ? "text-primary fill-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm ${
                        task.isCompleted
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.task}
                    </span>
                    <div className="flex ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => handleStartEdit(task)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {tasks.length > 0 && displayedTasksCount < tasks.length && (
            <div className="text-center pt-2 text-muted-foreground text-xs">
              {hiddenTasksCount} more{" "}
              {hiddenTasksCount === 1 ? "task" : "tasks"} not displayed
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsViewAllOpen(true)}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          View All Tasks
        </Button>

        <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>All Tasks</DialogTitle>
              <DialogDescription>
                {tasks.length} total tasks, {completedTasks} completed,{" "}
                {displayedTasksCount}/5 displayed
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1 max-h-[60vh] overflow-auto pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No tasks yet. Add one to get started!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-md transition-colors ${
                      task.isCompleted ? "bg-muted/50" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full"
                      >
                        <CheckCircle2
                          className={`h-5 w-5 transition-colors ${
                            task.isCompleted
                              ? "text-primary fill-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-sm ${
                          task.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.task}
                      </span>
                      <div className="flex ml-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => handleStartEdit(task)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 ${
                            task.isDisplayed
                              ? "text-primary hover:text-primary/80"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          onClick={() => toggleTaskDisplay(task.id)}
                          title={
                            task.isDisplayed
                              ? "Remove from display"
                              : "Add to display"
                          }
                        >
                          {task.isDisplayed ? (
                            <Eye className="h-3.5 w-3.5" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2">
              {displayedTasksCount}/5 display slots used
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
