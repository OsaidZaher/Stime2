"use client";

import { useState, useEffect } from "react"; // Combine imports for useState and useEffect

import { useSession } from "next-auth/react";
import { Timer, Stopwatch } from "@/components/clock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
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
import { toast } from "sonner";

// Type definition for Subject
interface Subject {
  id: number;
  name: string;
}

// Type definition for the StudySessionProps
interface StudySessionProps {
  subjects: Subject[];
  addSubject: (newSubject: string) => void;
}

export default function StudySession() {
  const { data: session, status } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (status === "authenticated" && session) {
        try {
          const response = await fetch("/api/functionality/subjectAdd");
          console.log("Fetch response:", response);
          if (response.ok) {
            const data = await response.json();
            setSubjects(data.subjects);
          } else {
            console.error("Failed to fetch subjects");
            toast.error("Failed to fetch subjects");
          }
        } catch (error) {
          console.error("Error fetching subjects:", error);
          toast.error("Error fetching subjects");
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchSubjects();
    }
  }, [status, session]);

  const addSubject = async (newSubject: string) => {
    if (status !== "authenticated") {
      toast.error("You must be logged in to add a subject");
      return;
    }

    if (
      newSubject.trim() &&
      !subjects.some((subject) => subject.name === newSubject)
    ) {
      try {
        const response = await fetch("/api/functionality/subjectAdd", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newSubject }),
        });

        if (response.ok) {
          const addedSubject = await response.json();
          setSubjects((prevSubjects) => [...prevSubjects, addedSubject]);
          toast.success("Subject added successfully");
        }
      } catch (error) {
        console.error("Error adding subject:", error);
        toast.error("Error adding subject");
      }
    }
  };

  const toggleView = () => {
    setShowTimer((prev) => !prev);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to access this page.</div>;
  }

  return (
    <SidebarInset>
      <div className="absolute top-4 right-4 z-50">
        <Button
          className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold text-sm shadow-md rounded-lg"
          variant="outline"
          onClick={toggleView}
        >
          {showTimer ? "Show Stopwatch" : "Show Timer"}
        </Button>
      </div>
      {/* Move StudyMenu to the top */}
      <div className=" ml-[750px] top-0 "></div>
      {/* Ensure main content is centered */}
      <main className="flex items-center justify-center min-h-screen bg-background">
        <SheetDemo
          subjects={subjects}
          addSubject={addSubject}
          showTimer={showTimer}
          toggleView={toggleView}
        />
      </main>
    </SidebarInset>
  );
}

interface SheetDemoProps {
  subjects: Subject[];
  addSubject: (newSubject: string) => void;
  showTimer: boolean;
  toggleView: () => void;
}

function SheetDemo({
  subjects,
  addSubject,
  showTimer,
  toggleView,
}: SheetDemoProps) {
  const [startTimer, setStartTimer] = useState(false);
  const [startStopwatch, setStartStopwatch] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const handleStartSession = () => {
    if (!selectedSubject || !topic) {
      toast.error(
        "Please select a subject and enter a topic before starting the session."
      );
      return;
    }

    // Start the appropriate timer based on current view
    if (showTimer) {
      setStartTimer(true);
    } else {
      setStartStopwatch(true);
    }

    setStartTime(new Date());
  };

  const handleSaveSession = async () => {
    if (!selectedSubject || !topic || !startTime) {
      toast.error(
        "Please fill in all fields and start the timer before saving."
      );
      return;
    }

    const endTime = new Date();
    setEndTime(endTime);

    try {
      const response = await fetch("/api/functionality/studySession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          topic,
          startTime,
          endTime,
          timerType: showTimer ? "timer" : "stopwatch",
        }),
      });

      if (response.ok) {
        toast.success("Study session saved successfully!");
        resetSession();
      } else {
        toast.error("Failed to save study session");
      }
    } catch (error) {
      console.error("Error saving study session:", error);
      toast.error("An error occurred while saving the study session");
    }
  };

  const resetSession = () => {
    setSelectedSubject(null);
    setTopic("");
    setStartTime(null);
    setEndTime(null);
    setStartTimer(false);
    setStartStopwatch(false);
  };

  return (
    <>
      <div className="relative inset-0 flex items-center justify-center z-50">
        <div className="pointer-events-auto">
          <Sheet>
            <SheetTrigger asChild>
              <div className="mt-[-175px] space-y-0 ml-10">
                {/* Display Timer or Stopwatch based on `showTimer` */}
                {showTimer ? (
                  <Timer startTimer={startTimer} onReset={resetSession} />
                ) : (
                  <Stopwatch
                    startStopwatch={startStopwatch}
                    onReset={resetSession}
                  />
                )}
                <div className="ml-24 space-x-20 mt-4">
                  {/* Start Study Button */}
                  <Button
                    className="bg-white h-24 w-64 dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold text-2xl shadow-md rounded-lg"
                    variant="outline"
                  >
                    Start Study
                  </Button>

                  {/* Save Session Button */}
                  <Button
                    className="bg-white h-24 w-64 dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold text-2xl shadow-md rounded-lg"
                    variant="outline"
                    onClick={handleSaveSession}
                  >
                    Save Session
                  </Button>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Study Session Details</SheetTitle>
                <SheetDescription>
                  Add your study session details.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <SelectDemo
                  subjects={subjects}
                  onSubjectSelect={setSelectedSubject}
                />
                <Input
                  placeholder="Add topic"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <DialogDemo addSubject={addSubject} />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSession(); // Use the existing handleStartSession method
                    }}
                  >
                    Start session
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

interface SelectDemoProps {
  subjects: Subject[];
  onSubjectSelect: (subjectId: number) => void;
}

function SelectDemo({ subjects, onSubjectSelect }: SelectDemoProps) {
  return (
    <Select onValueChange={(value) => onSubjectSelect(Number.parseInt(value))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Subjects</SelectLabel>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id.toString()}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface DialogDemoProps {
  addSubject: (newSubject: string) => void;
}

function DialogDemo({ addSubject }: DialogDemoProps) {
  const [newSubject, setNewSubject] = useState("");
  const [subjectAdded, setSubjectAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubject = async () => {
    if (newSubject.trim() === "") {
      setErrorMessage("Empty field");
      setSubjectAdded(false);
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectAdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubject }),
      });

      if (response.ok) {
        addSubject(newSubject);
        setNewSubject("");
        setErrorMessage("");
        setSubjectAdded(true);
        setTimeout(() => setSubjectAdded(false), 1500);
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
            <p className="text-red-600 mr-10 font-semibold text-lg">
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
