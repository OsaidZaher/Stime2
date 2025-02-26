"use client";

import { useState, useEffect, useRef } from "react"; // Combine imports for useState and useEffect
import { useSession } from "next-auth/react";
import { useTimeContext } from "@/app/contexts/TimerContext";
import {
  TimeComponent,
  AlarmPicker,
  AlarmPopup,
  useAlarm,
} from "@/components/clock";
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

  const fetchSubjects = async () => {
    if (status === "authenticated" && session) {
      try {
        const response = await fetch("/api/functionality/subjectAdd");
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.subjects);
        } else {
          toast.error("Failed to fetch subjects");
        }
      } catch (error) {
        toast.error("Error fetching subjects");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubjects();
    }
  }, [status, session]);

  const addSubject = async (newSubject: string) => {
    fetchSubjects(); // Refresh subject list after adding
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
      <div className="absolute top-4 right-4 z-50"></div>
      <div className=" ml-[750px] top-0 "></div>
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
  // Get context values
  const {
    isRunning,
    startTimer,
    mode,
    selectedAlarm,
    setSelectedAlarm,
    resetTimer,
  } = useTimeContext();

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showAlarmPopup, setShowAlarmPopup] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleStartSession = () => {
    if (!selectedSubject || !topic) {
      toast.error(
        "Please select a subject and enter a topic before starting the session."
      );
      return;
    }

    // Use context to start the timer
    startTimer();
    setStartTime(new Date());
    setIsSheetOpen(false); // Close the sheet after starting
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
          timerType: mode,
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
    resetTimer();
  };

  const { playAlarm, stopAlarm, isLoaded } = useAlarm(selectedAlarm, () =>
    setShowAlarmPopup(false)
  );

  const handleTimerEnd = async () => {
    await playAlarm();
    setShowAlarmPopup(true);
    handleSaveSession();
  };

  const handleStopAlarm = () => {
    stopAlarm();
    setShowAlarmPopup(false);
  };

  const handleOpenSheet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="relative inset-0 flex items-center justify-center z-50">
        <div className="pointer-events-auto">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            {/* Timer/Stopwatch components are now OUTSIDE the SheetTrigger */}
            <div className="mt-[-175px] space-y-0 ml-10">
              <TimeComponent
                mode={showTimer ? "timer" : "stopwatch"}
                startTime={isRunning}
                onReset={resetSession}
                onTimeEnd={handleTimerEnd}
                selectedAlarm={selectedAlarm}
              />
              <div className="flex ml-20 mt-4 space-x-20 items-start">
                {/* This button is now the SheetTrigger */}
                <SheetTrigger asChild>
                  <Button
                    className="bg-white h-24 w-64 dark:bg-black text-black dark:text-white border-color-200 outline-color-500 font-semibold text-2xl shadow-md rounded-lg"
                    variant="outline"
                    onClick={handleOpenSheet}
                  >
                    Start Study
                  </Button>
                </SheetTrigger>

                {/* Save Session Button */}
                <div className="flex flex-col">
                  <Button
                    className="bg-white border-color-200 h-24 w-64 dark:bg-black text-black dark:text-white font-semibold text-2xl shadow-md rounded-lg"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveSession();
                    }}
                  >
                    Save Session
                  </Button>
                </div>

                <div className="flex flex-col space-y-4">
                  <AlarmPicker onAlarmSelect={setSelectedAlarm} />
                  <Button
                    className="w-40 h-10 bg-white dark:bg-black text-black dark:text-white border-color-200 font-semibold text-sm shadow-md rounded-lg"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleView();
                    }}
                  >
                    {showTimer ? "Study Stopwatch" : "Study Timer"}
                  </Button>
                </div>
              </div>
            </div>
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
                      handleStartSession();
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

      {showAlarmPopup && <AlarmPopup onStop={handleStopAlarm} />}
    </>
  );
}
interface DialogDemoProps {
  addSubject: (newSubject: string) => void;
}

function DialogDemo({ addSubject }: DialogDemoProps) {
  const [newSubject, setNewSubject] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      setErrorMessage("Subject name cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/functionality/subjectAdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubject }),
      });

      if (response.ok) {
        const data = await response.json();
        addSubject(newSubject);
        setNewSubject("");
        setErrorMessage("");
        toast.success("Subject added successfully");
      } else {
        const errorData = await response.json();

        if (response.status === 409) {
          setErrorMessage("A subject with this name already exists");
        } else {
          setErrorMessage(errorData.error || "Failed to add subject");
        }
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
              onChange={(e) => {
                setNewSubject(e.target.value);
                setErrorMessage(""); // Clear error when typing
              }}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-start space-x-4">
          {errorMessage && (
            <p className="text-red-600 mr-10 font-semibold text-lg">
              {errorMessage}
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
