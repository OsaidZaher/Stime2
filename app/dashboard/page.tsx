"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";
import CombinedDashboardCard from "@/components/ui/dashTimeCard";
import TodoListCard from "@/components/ui/toDo";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBarMotion } from "@/components/ui/sideBarMotion";

export default function Page() {
  return (
    <>
      <SidebarProvider>
        <SideBarMotion>
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
                <LogInCard />
                <CombinedDashboardCard />
              </div>
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <SubjectGoalsCard />
                <TodoListCard />
              </div>
            </div>
          </div>
        </SideBarMotion>
      </SidebarProvider>
    </>
  );
}
