"use client";

import { useState, useEffect, useMemo } from "react";
import { StudySession, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function getStudySessions(): Promise<StudySession[]> {
  const response = await fetch("/api/functionality/studySession");
  if (!response.ok) {
    throw new Error("Failed to fetch study sessions");
  }

  const data = await response.json();

  const formattedData = data.map((session: any) => ({
    id: session.id,
    subjectName: session.subject.name,
    topic: session.topic,
    duration: calculateDuration(session.duration),
    startTime: session.startTime,
  }));

  return formattedData;
}

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
  const [data, setData] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  async function refreshData() {
    setIsLoading(true);
    try {
      const freshData = await getStudySessions();
      setData(freshData);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  // Memoized filtered data

  const filteredData = useMemo(() => {
    return data.filter((session) => {
      // Search filter
      const matchesSearch =
        session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

      // Time filter
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

  return (
    <div className="container mx-auto py-10 font-semibold">
      {isLoading ? (
        <p>Loading study sessions...</p>
      ) : (
        <div className="text-blue-500 dark:text-blue-800 space-y-4">
          <div className="grid grid-cols-2 gap-[975px]">
            <FindBy searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <TimeSelect
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>
          <DataTable columns={columns} data={filteredData} />
        </div>
      )}
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
      <SelectTrigger className="w-[180px]">
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
    <div className="relative">
      <Input
        type="text"
        placeholder="Search Topic or Subject"
        className="max-w-ld w-56 max-h-md"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Search className="absolute left-48 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}
