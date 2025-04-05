import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

// Define the props interface
interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    task: string;
    priority: string;
    dueDate: string | null;
    isCompleted: boolean;
  }) => void;
  initialData: {
    task: string;
    priority: string;
    dueDate: string | null;
    isCompleted: boolean;
  } | null;
}

export function EditTaskDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditTaskDialogProps) {
  // Local state for the form
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState(false);

  // Update local state when initialData changes
  useEffect(() => {
    if (initialData) {
      setTask(initialData.task);
      setPriority(initialData.priority);
      setDueDate(
        initialData.dueDate ? new Date(initialData.dueDate) : undefined
      );
      setIsCompleted(initialData.isCompleted);
    }
  }, [initialData]);

  // Handle save
  const handleSave = () => {
    onSave({
      task,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      isCompleted,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="task">Task</label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="priority">Priority</label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
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
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(checked === true)}
            />
            <label htmlFor="completed">Mark as completed</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
