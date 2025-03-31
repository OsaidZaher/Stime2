"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { type StudySession, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Failed to fetch study sessions");

    const data = await res.json();
    return data.map((session: any) => ({
      id: session.id,
      subjectName: session.subject.name,
      topic: session.topic,
      duration: calculateDuration(session.duration),
      startTime: session.startTime,
    }));
  });

function calculateDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  let durationString = "";

  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    durationString += `${minutes}m `;
  }
  durationString += `${seconds}s`;

  return durationString;
}

export default function StudySessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // Use SWR for data fetching
  const { data, error, isLoading, mutate } = useSWR<StudySession[]>(
    "/api/functionality/studySession",
    fetcher
  );

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((session) => {
      const matchesSearch =
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

      const now = new Date();
      let matchesTimeFilter = true;

      switch (timeFilter) {
        case "past24hrs":
          matchesTimeFilter =
            now.getTime() - new Date(session.startTime).getTime() <=
            24 * 60 * 60 * 1000;
          break;
        case "past7days":
          matchesTimeFilter =
            now.getTime() - new Date(session.startTime).getTime() <=
            7 * 24 * 60 * 60 * 1000;
          break;
        case "past30days":
          matchesTimeFilter =
            now.getTime() - new Date(session.startTime).getTime() <=
            30 * 24 * 60 * 60 * 1000;
          break;
        default: // "all"
          matchesTimeFilter = true;
      }

      return matchesSearch && matchesTimeFilter;
    });
  }, [data, searchTerm, timeFilter]);

  // Function to manually refresh data if needed
  const refreshData = () => {
    mutate();
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-6 font-semibold">
      <div className="text-600 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <FindBy searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <TimeSelect
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 p-4">
              <Skeleton className="h-6 w-24 sm:w-36" />
              <Skeleton className="h-6 w-24 sm:w-36" />
              <Skeleton className="h-6 w-24 sm:w-36" />
              <Skeleton className="h-6 w-24 sm:w-36" />
            </div>

            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-4 p-4 border-t"
                >
                  <Skeleton className="h-5 w-24 sm:w-36" />
                  <Skeleton className="h-5 w-24 sm:w-36" />
                  <Skeleton className="h-5 w-16 sm:w-24" />
                  <Skeleton className="h-5 w-24 sm:w-36" />
                </div>
              ))}
          </div>
        ) : error ? (
          <p>Error loading study sessions. Please try again.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={filteredData} />
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSelect({
  timeFilter,
  onTimeFilterChange,
}: {
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
}) {
  return (
    <Select value={timeFilter} onValueChange={onTimeFilterChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Time</SelectItem>
        <SelectItem value="past24hrs">Past 24 hrs</SelectItem>
        <SelectItem value="past7days">Past 7 days</SelectItem>
        <SelectItem value="past30days">Past 30 days</SelectItem>
      </SelectContent>
    </Select>
  );
}

function FindBy({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <Input
        type="text"
        placeholder="Search Topic or Subject"
        className="w-full sm:w-56 pr-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    </div>
  );
}
