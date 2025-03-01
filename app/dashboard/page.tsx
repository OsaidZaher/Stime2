"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";
import DashTimeCard from "@/components/ui/dashTimeCard";
import TodoListCard from "@/components/ui/toDo";

export default function Page() {
  return (
    <>
      <div className="flex space-x-10 ">
        <div className="space-y-16">
          <LogInCard />
          <DashTimeCard />
        </div>
        {<SubjectGoalsCard />}
        <TodoListCard />
      </div>
    </>
  );
}
