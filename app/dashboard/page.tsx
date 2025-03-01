"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";
import DashTimeCard from "@/components/ui/dashTimeCard";
import TodoListCard from "@/components/ui/toDo";
import { SideBarMotion } from "@/components/ui/sideBarMotion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <>
      <SidebarInset className="p-8 ml-28">
        <div className="flex space-x-10 w-full">
          <div className="space-y-16">
            <LogInCard />
            <DashTimeCard />
          </div>
          {<SubjectGoalsCard />}
          <TodoListCard />
        </div>
      </SidebarInset>
    </>
  );
}
