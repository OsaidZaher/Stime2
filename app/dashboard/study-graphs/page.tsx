// page.tsx
import StudyStatistics5 from "./subject-compare";
import TotalTimeChart from "./total-time";
import { StudySessionsStats } from "./totalSessions";

export default function StudyGraph() {
  return (
    <div className="grid grid-cols-2 space-x-10">
      <div
        className="space-y-4 col-end-1
      "
      >
        <StudySessionsStats
          weekSessions={10}
          monthSessions={40}
          yearSessions={300}
          weekAverage="2h 30m"
          monthAverage="3h 15m"
          yearAverage="4h 10m"
        />
        <TotalTimeChart />
      </div>
      <StudyStatistics5 />
    </div>
  );
}
