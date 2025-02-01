// page.tsx
import { ComparativeChart } from "./time-compare";
import StudyStatistics5 from "./subject-compare";
import TotalTimeChart from "./total-time";
import SubjectHexagon from "./subject-hex";
import { StudySessionsStats, GradeCard, StudyGoalCard } from "./totalSessions";

export default function StudyGraph() {
  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min group-hover/bento:translate-x-2 transition duration-200">
      <div>
        <StudyStatistics5 />
      </div>

      <div>
        <GradeCard />
      </div>
      <div className="">
        <TotalTimeChart />
      </div>

      <div>
        <StudyGoalCard />
      </div>
      <div className="">
        <StudySessionsStats
          weekSessions={10}
          monthSessions={40}
          yearSessions={300}
          weekAverage="2h 30m"
          monthAverage="3h 15m"
          yearAverage="4h 10m"
        />
      </div>

      <div>{/*<SubjectHexagon />*/}</div>
    </div>
  );
}
