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

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Type definitions based on your schema
type Priority = "high" | "medium" | "low";

interface Todo {
  id: string;
  task: string;
  priority: Priority;
  dueDate: string | null;
  isCompleted: boolean;
}

export default function TodoListCard() {
  // State for new todo
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("medium");
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>(
    undefined
  );

  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedPriority, setEditedPriority] = useState<Priority>("medium");
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    undefined
  );
  const [editedIsCompleted, setEditedIsCompleted] = useState(false);

  // Fetch todos with SWR
  const { data, error, isLoading } = useSWR<{ taskToDo: Todo[] }>(
    "/api/functionality/toDo",
    fetcher
  );

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Get priority color based on priority level
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300";
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTodo,
          priority: newTodoPriority,
          isCompleted: false,
          dueDate: newTodoDueDate ? newTodoDueDate.toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      // Reset form and refresh data
      setNewTodo("");
      setNewTodoPriority("medium");
      setNewTodoDueDate(undefined);
      mutate("/api/todos");
      toast.success("Task added successfully");
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    const todo = data?.taskToDo.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch("/api/todos", {
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

      if (!response.ok) throw new Error("Failed to update task");

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

      if (!response.ok) throw new Error("Failed to delete task");

      mutate("/api/todos");
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  // Open edit dialog
  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditedTask(todo.task);
    setEditedPriority(todo.priority);
    setEditedDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setEditedIsCompleted(todo.isCompleted);
    setIsEditDialogOpen(true);
  };

  // Save edited todo
  const saveEditedTodo = async () => {
    if (!editingTodo || !editedTask.trim()) return;

    try {
      const response = await fetch("/api/functionality/toDo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTodo.id,
          editedTask,
          isCompleted: editedIsCompleted,
          priority: editedPriority,
          dueDate: editedDueDate ? editedDueDate.toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setIsEditDialogOpen(false);
      mutate("/api/todos");
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  // Handle loading and error states
  if (isLoading)
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">To-Do List</CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
      </Card>
    );

  if (error)
    return (
      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">To-Do List</CardTitle>
          <CardDescription className="text-red-500">
            Error loading tasks
          </CardDescription>
        </CardHeader>
      </Card>
    );

  // Get todos from data
  const todos = data?.taskToDo || [];

  return (
    <Card className="lg:col-span-2 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">To-Do List</CardTitle>
        <CardDescription>Manage your study tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-5">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="shadow-sm flex-grow"
          />
          <div className="flex space-x-2">
            <Select
              value={newTodoPriority}
              onValueChange={(value) => setNewTodoPriority(value as Priority)}
            >
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
                <Button
                  variant="outline"
                  className="w-[110px] pl-3 text-left font-normal"
                >
                  {newTodoDueDate ? (
                    format(newTodoDueDate, "MMM d")
                  ) : (
                    <span>Due date</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
              <div className="text-center py-6 text-muted-foreground">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              todos.map((todo) => (
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
                        <Badge variant="outline" className="text-xs">
                          {formatDate(todo.dueDate)}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            todo.priority
                          )}`}
                        >
                          {todo.priority}
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
            {todos.filter((todo) => !todo.isCompleted).length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No pending tasks. Great job!
              </div>
            ) : (
              todos
                .filter((todo) => !todo.isCompleted)
                .map((todo) => (
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
                          <Badge variant="outline" className="text-xs">
                            {formatDate(todo.dueDate)}
                          </Badge>
                          <Badge
                            className={`text-xs ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {todo.priority}
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
            {todos.filter((todo) => todo.isCompleted).length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No completed tasks yet.
              </div>
            ) : (
              todos
                .filter((todo) => todo.isCompleted)
                .map((todo) => (
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
                          <Badge variant="outline" className="text-xs">
                            {formatDate(todo.dueDate)}
                          </Badge>
                          <Badge
                            className={`text-xs opacity-70 ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {todo.priority}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="task">Task</label>
              <Input
                id="task"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority">Priority</label>
              <Select
                value={editedPriority}
                onValueChange={(value) => setEditedPriority(value as Priority)}
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
              <label>Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {editedDueDate ? (
                      format(editedDueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editedDueDate}
                    onSelect={setEditedDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={editedIsCompleted}
                onCheckedChange={(checked) =>
                  setEditedIsCompleted(checked === true)
                }
              />
              <label htmlFor="completed">Mark as completed</label>
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
