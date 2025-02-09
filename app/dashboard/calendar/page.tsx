"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExamTable } from "@/components/ui/examTable";
import { Calendar2 } from "@/components/ui/calendar2";
import GradeCard from "@/components/gradeCards";
import { mutate } from "swr";

export default function CardWithForm() {
  const [examName, setExamName] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!session) {
      toast?.error("You must be signed in to add an exam");
      return;
    }

    if (!examName || !date) {
      toast?.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/functionality/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examName,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create exam");
      }

      await response.json();

      setExamName("");
      setDate(undefined);

      toast?.success("Exam added successfully!");

      // Invalidate SWR cache so that Calendar2 and ExamTable update.
      mutate("/api/functionality/calendar");

      // Optionally, if you still need a page refresh:
      // router.refresh();
    } catch (error) {
      console.error("Error adding exam:", error);
      toast?.error("Failed to add exam");
    }
  };

  return (
    <div className="flex items-start justify-center space-x-8 ">
      {/* Calendar Section */}
      <div className="flex flex-col space-y-8">
        <Calendar2 />
        <GradeCard />
      </div>

      {/* Table and Card Section */}
      <div className="flex flex-col space-y-8">
        <ExamTable />

        <Card className="w-[550px] h-[350px]">
          <CardHeader>
            <CardTitle>Upcoming exam?</CardTitle>
            <CardDescription>Add it right here!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Exam Name</Label>
                  <Input
                    id="name"
                    placeholder="What exam is it?"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date">Exam Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Pick exam date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit}>Add Exam</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
