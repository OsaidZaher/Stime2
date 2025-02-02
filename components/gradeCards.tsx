import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

type Grade = {
  subjectId: number;
  subject: string;
  grade: string | number;
};

export default function GradeCard() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = async () => {
    try {
      const response = await fetch("/api/functionality/grade");
      if (!response.ok) {
        throw new Error("Failed to fetch grades");
      }
      const data = await response.json();

      const formattedGrades: Grade[] = data.subjects.flatMap((subject: any) =>
        subject.userGrades.map((gradeEntry: any) => ({
          subjectId: subject.id,
          subject: subject.name,
          grade: gradeEntry.grades[0],
        }))
      );

      setGrades(formattedGrades);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleDelete = async (subjectId: number) => {
    try {
      const response = await fetch(
        `/api/functionality/grade?subjectId=${subjectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      toast.success("Grade deleted successfully!");
      fetchGrades(); // Refresh grades list
    } catch (error) {
      toast.error("Error deleting subject");
    }
  };

  return (
    <Card className="w-[550px] h-[350px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-primary">
            Grades
          </CardTitle>
          <GradeDialog onGradeAdded={fetchGrades} />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <p>Loading...</p>
        ) : grades.length === 0 ? (
          <p>No grades available.</p>
        ) : (
          <ul className="space-y-4">
            {grades.map((grade, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-md font-medium text-gray-700">
                  {grade.subject.charAt(0).toUpperCase() +
                    grade.subject.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-sm font-semibold px-3 py-1"
                  >
                    {grade.grade}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(grade.subjectId)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface GradeDialogProps {
  onGradeAdded: () => void;
}

function GradeDialog({ onGradeAdded }: GradeDialogProps) {
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
        body: JSON.stringify({ subject, grade }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add grade");
      }

      setSubject("");
      setGrade("");
      setOpen(false);
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
              />
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
