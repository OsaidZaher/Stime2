"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";
import CombinedDashboardCard from "@/components/ui/dashTimeCard";
import TodoListCard from "@/components/ui/toDo";
import ActivityCard from "@/components/ui/ActivityCard";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBarMotion } from "@/components/ui/sideBarMotion";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CombinedDashboardCard />
          <TodoListCard />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SubjectGoalsCard />
          <ActivityCard />
        </div>
      </div>
    </>
  );
}
