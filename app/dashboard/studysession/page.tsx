"use client";

import * as React from "react";
import { Roboto_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type definition for the addSubject function
interface StudySessionProps {
  subjects: string[];
  addSubject: (newSubject: string) => void;
}

export default function StudySession() {
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); // Loading state

  // Fetch subjects from the database on component mount
  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/functionality/getSubjects"); // Adjusted API route to fetch subjects
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects); // Update the subjects state with data from the database
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchSubjects();
  }, []);

  // Add new subject and update the state
  const addSubject = (newSubject: string) => {
    if (!subjects.includes(newSubject) && newSubject.trim() !== "") {
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]); // Add new subject to state
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Loading indication
  }

  return <SheetDemo subjects={subjects} addSubject={addSubject} />;
}

// Updated props typing for SheetDemo
export function SheetDemo({ subjects, addSubject }: StudySessionProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Start Study</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Study Session Details</SheetTitle>
          <SheetDescription>Add your study session details.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <SelectDemo subjects={subjects} />
          </div>
          <Input placeholder="Add topic" id="topic" />
          <div className="grid grid-cols-4 items-center gap-4">
            <DialogDemo addSubject={addSubject} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Start session</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// SelectDemo Component
interface SelectDemoProps {
  subjects: string[];
}

export function SelectDemo({ subjects }: SelectDemoProps) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Subjects</SelectLabel>
          {subjects.map((subject, index) => (
            <SelectItem key={index} value={subject.toLowerCase()}>
              {subject}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// DialogDemo Component
interface DialogDemoProps {
  addSubject: (newSubject: string) => void;
}

export function DialogDemo({ addSubject }: DialogDemoProps) {
  const [newSubject, setNewSubject] = React.useState<string>("");
  const [subjectAdded, setSubjectAdded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleAddSubject = async () => {
    if (newSubject.trim() === "") {
      setErrorMessage("Empty field");
      setSubjectAdded(false);
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newSubject }),
      });

      if (response.ok) {
        addSubject(newSubject); // Update parent state with the new subject
        setNewSubject(""); // Reset the input field
        setErrorMessage(""); // Clear any error messages
        setSubjectAdded(true); // Show success message

        setTimeout(() => {
          setSubjectAdded(false); // Hide success message after delay
        }, 1500);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      setErrorMessage("Failed to add subject");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[180px]" variant="outline">
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Subject
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-start space-x-4">
          {errorMessage && (
            <p className="text-red-600 mr-10 font-semibold text-lg robotoMono.className">
              {errorMessage}
            </p>
          )}

          {subjectAdded && (
            <p className="text-green-600 mr-20 font-semibold">
              New Subject Added!
            </p>
          )}

          <Button type="submit" onClick={handleAddSubject}>
            Add subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
