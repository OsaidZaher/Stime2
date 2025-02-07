// page.tsx
import StudyStatistics5 from "./subject-compare";
import TotalTimeChart from "./total-time";
import { StudySessionsStats } from "./totalSessions";
import GradeChanges from "@/components/gradeImprovement";

export default function StudyGraph() {
  return (
    <div className="flex justify-center space-x-8 ">
      <div className="space-y-8">
        <StudySessionsStats />
        <TotalTimeChart />
      </div>
      <div className="space-y-8">
        <StudyStatistics5 />
        <GradeChanges />
      </div>
    </div>
  );
}
