"use client";

import { useState, useEffect } from "react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import type { Exam } from "@prisma/client";
import useSWR from "swr";

import { Card } from "@/components/ui/card";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Calendar2({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { data: exams, error } = useSWR<Exam[]>(
    "/api/functionality/calendar",
    fetcher
  );

  if (error) {
    console.error("Error fetching exams:", error);
  }

  const examDays = exams ? exams.map((exam) => new Date(exam.date)) : [];

  return (
    <Card className="w-full max-w-2xl h-[372.5px] flex items-center justify-center ">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("w-full h-full p-6", className)}
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
          months: "flex flex-col space-y-8",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center h-10",
          caption_label: "text-xl font-bold",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse h-[300px]",
          head_row: "flex justify-between mb-1 font-large",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-medium text-lg text-center",
          row: "flex justify-between w-full mt-1",
          cell: cn(
            "relative p-0 text-center text-sm flex justify-center items-center h-8",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal text-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
            <ChevronLeftIcon
              className={cn(
                "h-6 w-6",
                (className = "text-blue-600 font-extrabold")
              )}
              {...props}
            />
          ),
          IconRight: ({
            className,
            ...props
          }: Omit<
            React.ComponentProps<typeof ChevronRightIcon>,
            "children"
          >) => (
            <ChevronRightIcon
              className={cn(
                "h-6 w-6",
                (className = "text-blue-600 font-extrabold")
              )}
              {...props}
            />
          ),
        }}
        {...props}
      />
    </Card>
  );
}

Calendar2.displayName = "Calendar2";
