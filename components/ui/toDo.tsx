"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

interface ToDo {
  id: string;
  task: string;
  isCompleted: boolean;
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TodoListCard() {
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const { data, error, isLoading } = useSWR("/api/functionality/toDo", fetcher);
  const tasks: ToDo[] = data?.taskToDo || [];

  const completedTasksCount = tasks.filter((task) => task.isCompleted).length;

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      mutate(
        "/api/functionality/toDo",
        {
          taskToDo: tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !currentStatus } : t
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
          isCompleted: !currentStatus,
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

  const handleDeleteTask = async (taskId: string) => {
    try {
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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newTask.trim()) {
        toast.error("Task cannot be empty");
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        id: tempId,
        task: newTask,
        isCompleted: false,
        userId: "",
      };

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
    <Card className="w-full max-w-lg  shadow-lg rounded-xl overflow-hidden border border-blue-100  dark:border-[hsl(232,39%,11%)]">
      <CardHeader className="p-6 gradient-bg text-white">
        <CardTitle className="text-2xl font-bold">My Tasks</CardTitle>
        <p className="text-sm mt-2 text-blue-100">
          {completedTasksCount} of {tasks.length} tasks completed
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <form onSubmit={handleAddTask} className="flex space-x-2">
            <Input
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow border-blue-200 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="submit"
              className=" theme-background theme-hover text-slate-100"
            >
              <Plus className="h-4 w-4 mr-2 theme-hover" />
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : (
            <AnimatePresence>
              {tasks.length === 0 ? (
                <p className="text-center theme-text py-4">
                  No tasks yet. Add one to get started!
                </p>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 p-3 rounded-lg light-bg transition-colors"
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.isCompleted}
                      onCheckedChange={() =>
                        handleToggleTask(task.id, task.isCompleted)
                      }
                      className="h-5 w-5 rounded-md light-bg text-theme"
                    />
                    {editingTaskId === task.id ? (
                      <Input
                        value={editedTaskText}
                        onChange={(e) => setEditedTaskText(e.target.value)}
                        onBlur={() => handleEditTask(task.id)}
                        onKeyUp={(e) =>
                          e.key === "Enter" && handleEditTask(task.id)
                        }
                        className="flex-grow "
                        autoFocus
                      />
                    ) : (
                      <label
                        htmlFor={task.id}
                        className={`text-sm flex-grow ${
                          task.isCompleted
                            ? "theme-text line-through"
                            : "text-black"
                        }`}
                      >
                        {task.task}
                      </label>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(task)}
                      className="theme-text theme-hover hover:bg-blue-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="theme-text  theme-hover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
