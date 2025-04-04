"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR, { mutate } from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

import type { Priority, toDo } from "@prisma/client";

export default function TodoListCard() {
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<string>("medium");
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>(
    undefined
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    task: string;
    priority: Priority;
    isCompleted: boolean;
    dueDate: Date | null;
  } | null>(null);

  // Fetch todos
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/functionality/toDo", fetcher);

  const todos = data?.taskToDo || [];

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTodo,
          priority: newTodoPriority.toUpperCase(),
          isCompleted: false,
          dueDate: newTodoDueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setNewTodo("");
      setNewTodoPriority("medium");
      setNewTodoDueDate(undefined);
      mutate("/api/functionality/toDo");
      toast.success("Task added successfully");
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t: toDo) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          editedTask: todo.task,
          isCompleted: !todo.isCompleted,
          priority: todo.priority,
          dueDate: todo.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      mutate("/api/functionality/toDo");
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      mutate("/api/functionality/toDo");
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  // Open edit dialog
  const openEditDialog = (todo: toDo) => {
    setEditingTodo({
      id: todo.id,
      task: todo.task,
      priority: todo.priority,
      isCompleted: todo.isCompleted,
      dueDate: todo.dueDate,
    });
    setIsEditDialogOpen(true);
  };

  // Save edited todo
  const saveEditedTodo = async () => {
    if (!editingTodo) return;

    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTodo.id,
          editedTask: editingTodo.task,
          isCompleted: editingTodo.isCompleted,
          priority: editingTodo.priority,
          dueDate: editingTodo.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setIsEditDialogOpen(false);
      mutate("/api/functionality/toDo");
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300";
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">To-Do List</CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">To-Do List</CardTitle>
          <CardDescription>Error loading tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Failed to load tasks. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">To-Do List</CardTitle>
        <CardDescription>Manage your study tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-5">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="shadow-sm"
          />
          <Select value={newTodoPriority} onValueChange={setNewTodoPriority}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={newTodoDueDate}
                onSelect={setNewTodoDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={addTodo}>Add</Button>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              todos.map((todo: toDo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    todo.isCompleted
                      ? "bg-slate-50 dark:bg-slate-900/50"
                      : "bg-white dark:bg-slate-900 shadow-sm hover:shadow"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.isCompleted}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5"
                    />
                    <div>
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`font-medium ${
                          todo.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {todo.task}
                      </label>
                      <div className="flex items-center mt-1 space-x-2">
                        {todo.dueDate && (
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                          </Badge>
                        )}
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {todo.priority.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(todo)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="pending" className="space-y-3">
            {todos.filter((todo: toDo) => !todo.isCompleted).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending tasks. All caught up!
              </div>
            ) : (
              todos
                .filter((todo: toDo) => !todo.isCompleted)
                .map((todo: toDo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`pending-${todo.id}`}
                        checked={todo.isCompleted}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="h-5 w-5"
                      />
                      <div>
                        <label
                          htmlFor={`pending-${todo.id}`}
                          className="font-medium"
                        >
                          {todo.task}
                        </label>
                        <div className="flex items-center mt-1 space-x-2">
                          {todo.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                            </Badge>
                          )}
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {todo.priority.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(todo)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>
          <TabsContent value="completed" className="space-y-3">
            {todos.filter((todo: toDo) => todo.isCompleted).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No completed tasks yet.
              </div>
            ) : (
              todos
                .filter((todo: toDo) => todo.isCompleted)
                .map((todo: toDo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`completed-${todo.id}`}
                        checked={todo.isCompleted}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="h-5 w-5"
                      />
                      <div>
                        <label
                          htmlFor={`completed-${todo.id}`}
                          className="font-medium line-through text-muted-foreground"
                        >
                          {todo.task}
                        </label>
                        <div className="flex items-center mt-1 space-x-2">
                          {todo.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                            </Badge>
                          )}
                          <Badge
                            className={`text-xs opacity-70 ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {todo.priority.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task">Task</Label>
              <Input
                id="task"
                value={editingTodo?.task || ""}
                onChange={(e) =>
                  setEditingTodo((prev) =>
                    prev ? { ...prev, task: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editingTodo?.priority.toLowerCase() || "medium"}
                onValueChange={(value) =>
                  setEditingTodo((prev) =>
                    prev
                      ? { ...prev, priority: value.toUpperCase() as Priority }
                      : null
                  )
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editingTodo?.dueDate ? (
                      format(new Date(editingTodo.dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={
                      editingTodo?.dueDate
                        ? new Date(editingTodo.dueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setEditingTodo((prev) =>
                        prev ? { ...prev, dueDate: date || null } : null
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedTodo}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
