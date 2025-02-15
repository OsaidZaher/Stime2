import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import useSWR from "swr";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SUBJECTS_PER_CARD = 4;

type Grade = {
  subjectId: number;
  subject: string;
  grades: (string | number)[];
  gradeIds: number[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GradeCard() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, error, isLoading, mutate } = useSWR(
    "/api/functionality/grade",
    fetcher
  );

  const grades: Grade[] = useMemo(() => {
    if (!data || !data.subjects) return [];
    const gradesBySubject: { [key: string]: Grade } = {};

    data.subjects.forEach((subject: any) => {
      subject.userGrades.forEach((gradeEntry: any) => {
        const subjectName = subject.name.toLowerCase();
        if (!gradesBySubject[subjectName]) {
          gradesBySubject[subjectName] = {
            subjectId: subject.id,
            subject: subject.name,
            grades: [],
            gradeIds: [],
          };
        }
        gradesBySubject[subjectName].grades.push(gradeEntry.grades[0]);
        gradesBySubject[subjectName].gradeIds.push(gradeEntry.id);
      });
    });

    return Object.values(gradesBySubject);
  }, [data]);

  const totalPages = Math.ceil(grades.length / SUBJECTS_PER_CARD);

  // Adjust the current page if it becomes out of bounds after deletion.
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const currentGrades = grades.slice(
    currentPage * SUBJECTS_PER_CARD,
    (currentPage + 1) * SUBJECTS_PER_CARD
  );

  const handleDeleteGrade = async (subjectId: number, gradeIndex: number) => {
    try {
      const subject = grades.find((g) => g.subjectId === subjectId);
      if (!subject) return;

      const gradeId = subject.gradeIds[gradeIndex];

      const response = await fetch(`/api/functionality/grade`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gradeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete grade");
      }

      // Revalidate the SWR data.
      mutate();
      toast.success("Grade deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error deleting grade"
      );
    }
  };

  const handleNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "right" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card className="w-[550px] h-[350px] relative">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-primary">
            Grades
          </CardTitle>
          {/* Pass the mutate function as a callback to revalidate after adding a grade */}
          <GradeDialog
            onGradeAdded={mutate}
            existingSubjects={grades.map((g) => g.subject)}
          />
        </div>
      </CardHeader>
      <CardContent
        className="pt-6 overflow-y-auto"
        style={{ maxHeight: "calc(100% - 130px)" }}
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : !grades.length ? (
          <p>No grades have been added.</p>
        ) : (
          <ul className="space-y-4">
            {currentGrades.map((grade, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-md font-medium text-gray-700 dark:text-slate-100">
                  {grade.subject.charAt(0).toUpperCase() +
                    grade.subject.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {grade.grades.map((g, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-sm font-semibold px-3 py-1 relative pr-8"
                      >
                        {g}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 absolute right-1"
                          onClick={() =>
                            handleDeleteGrade(grade.subjectId, idx)
                          }
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-red-500">Error loading grades.</p>}
      </CardContent>
      {grades.length > SUBJECTS_PER_CARD && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation("left")}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation("right")}
            disabled={currentPage >= totalPages - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

interface GradeDialogProps {
  onGradeAdded: () => void;
  existingSubjects: string[];
}

function GradeDialog({ onGradeAdded, existingSubjects }: GradeDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/functionality/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.toLowerCase(),
          grade,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add grade");
      }

      setSubject("");
      setGrade("");
      setOpen(false);
      // Revalidate the SWR data after adding a grade.
      onGradeAdded();
      toast.success("Grade added successfully!");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Grade</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-bold">
              It's time to add your grade
            </DialogTitle>
            <DialogDescription>
              Keep track of your grades to see if you are improving!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter Subject"
                className="col-span-3"
                list="subjects"
              />
              <datalist id="subjects">
                {existingSubjects.map((subject, idx) => (
                  <option key={idx} value={subject} />
                ))}
              </datalist>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter Grade"
                className="col-span-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit">Add Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
