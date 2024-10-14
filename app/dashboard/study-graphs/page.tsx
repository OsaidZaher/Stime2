import { ComparativeChart } from "./time-compare";
import { SubjectStudyChart } from "./subject-compare";
import TotalTimeChart from "./total-time";
import SubjectHexagon from "./subject-hex";

export default function StudyGraph() {
  return (
    <>
      <div
        className="grid grid-cols-2 gap-x-10 gap-y-10 ml-60 mb-10"
        style={{ gridTemplateColumns: "600px 600px" }}
      >
        <ComparativeChart />
        <SubjectStudyChart />
        <TotalTimeChart />
        <SubjectHexagon />
      </div>
    </>
  );
}
