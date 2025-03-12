"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
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
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardWithForm() {
  const [examName, setExamName] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { data: session, status } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isLoading = status === "loading";

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

      mutate("/api/functionality/calendar");
    } catch (error) {
      console.error("Error adding exam:", error);
      toast?.error("Failed to add exam");
    }
  };

  return (
    <>
      <div
        className={cn(
          "container w-full px-2 py-4 transition-all duration-500 ease-in-out mt-[-10]",
          isCollapsed ? "ml-96" : "ml-52"
        )}
      >
        <div className={cn("flex flex-col lg:flex-row gap-4 w-full")}>
          {" "}
          <div className="w-full lg:w-1/2 xl:w-2/5 space-y-4">
            {" "}
            <Calendar2 />
            <GradeCard />
          </div>
          <div className="w-full lg:w-1/2 xl:w-3/5 space-y-4 flex flex-col">
            {" "}
            <div className="flex-1">
              <ExamTable />
            </div>
            <div className="flex-1">
              {isLoading ? (
                <Card className="w-full max-w-xl h-full shadow-md rounded-xl overflow-hidden border border-color-100">
                  {" "}
                  <CardHeader className="p-4">
                    {" "}
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {" "}
                    <div className="grid w-full items-center gap-4">
                      {" "}
                      {/* Reduced gap */}
                      <div className="flex flex-col space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    {" "}
                    {/* Added padding control */}
                    <Skeleton className="h-8 w-20" />
                  </CardFooter>
                </Card>
              ) : (
                <Card className="w-full max-w-xl h-full shadow-md rounded-xl overflow-hidden border border-color-100">
                  {" "}
                  <CardHeader className="p-4">
                    {" "}
                    <CardTitle className="text-xl">Upcoming exam?</CardTitle>
                    {/* Reduced text size */}
                    <CardDescription>Add it right here!</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {" "}
                    <form onSubmit={handleSubmit}>
                      <div className="grid w-full items-center gap-4">
                        {" "}
                        {/* Reduced gap */}
                        <div className="flex flex-col space-y-1">
                          {" "}
                          <Label htmlFor="name" className="text-sm">
                            Exam Name
                          </Label>{" "}
                          <Input
                            id="name"
                            placeholder="What exam is it?"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          {" "}
                          <Label htmlFor="date" className="text-sm">
                            Exam Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal h-8 text-sm", // Reduced height and text size
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
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
                  <CardFooter className="flex justify-between p-4">
                    <Button
                      onClick={handleSubmit}
                      className="bg-color-500 h-8 text-sm"
                    >
                      Add Exam
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
