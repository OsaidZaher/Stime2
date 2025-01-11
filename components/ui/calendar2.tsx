"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Exam } from "@prisma/client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar2({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/functionality/calendar");
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  // Create a modifier for exam dates
  const examDays = exams.map((exam) => new Date(exam.date));

  return (
    <Card className="w-[550px] h-[525px] flex items-center mr-3 mt-16">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("w-full h-full p-4", className)}
        modifiers={{
          exam: examDays,
        }}
        modifiersStyles={{
          exam: {
            backgroundColor: "rgb(219 234 254)",
            fontWeight: "bold",
          },
        }}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center h-14",
          caption_label: "text-xl font-semibold",
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-9 w-12 bg-transparent p-0 opacity-70 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse h-[260px]",
          head_row: "flex justify-between mb-2",
          head_cell:
            "text-muted-foreground rounded-md w-10 font-medium text-base text-center",
          row: "flex justify-between w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-base flex justify-center items-center h-14",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-medium text-base hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({
            className,
            ...props
          }: Omit<
            React.ComponentProps<typeof ChevronLeftIcon>,
            "children"
          >) => (
            <ChevronLeftIcon className={cn("h-6 w-6", className)} {...props} />
          ),
          IconRight: ({
            className,
            ...props
          }: Omit<
            React.ComponentProps<typeof ChevronRightIcon>,
            "children"
          >) => (
            <ChevronRightIcon className={cn("h-6 w-6", className)} {...props} />
          ),
        }}
        {...props}
      />
    </Card>
  );
}

Calendar2.displayName = "Calendar2";

export { Calendar2 };
