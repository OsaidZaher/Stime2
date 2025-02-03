"use client";
import { ColumnDef } from "@tanstack/react-table";

export interface StudySession {
  id: number;
  subjectName: string;
  topic: string;
  duration: string;
  startTime: string;
}

export const columns: ColumnDef<StudySession>[] = [
  {
    header: "Subject",
    accessorKey: "subjectName",
  },
  {
    header: "Topic",
    accessorKey: "topic",
  },
  {
    header: "Duration",
    accessorKey: "duration",
  },
];
