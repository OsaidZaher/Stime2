"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";

export default function Page() {
  return (
    <>
      <div className="flex space-x-10">
        <LogInCard />
        {<SubjectGoalsCard />}
      </div>
    </>
  );
}
