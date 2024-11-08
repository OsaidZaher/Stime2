"use client";

import { useState, useEffect } from "react";
import { StudySession, columns } from "./columns";
import { DataTable } from "./data-table";

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

  return (
    <div className="container mx-auto py-10 font-semibold">
      {isLoading ? (
        <p>Loading study sessions...</p>
      ) : (
        <div className="text-blue-700 dark:text-blue-800 ">
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
}
