// columns.ts

"use client";
import { ColumnDef } from "@tanstack/react-table";

// Define the StudySession type
export interface StudySession {
  id: number;
  subjectName: string; // Add subjectName
  topic: string; // Add topic
  duration: string; // Add duration
}

// Update your columns array
export const columns: ColumnDef<StudySession>[] = [
  {
    header: "Subject",
    accessorKey: "subjectName", // This should match the key in your data
  },
  {
    header: "Topic",
    accessorKey: "topic", // This should match the key in your data
  },
  {
    header: "Duration",
    accessorKey: "duration", // This should match the key in your data
  },
];
