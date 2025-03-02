"use client";
import LogInCard from "@/components/ui/logInCard";
import SubjectGoalsCard from "@/components/ui/subjectGoals";
import DashTimeCard from "@/components/ui/dashTimeCard";
import TodoListCard from "@/components/ui/toDo";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SideBarMotion } from "@/components/ui/sideBarMotion";

export default function Page() {
  return (
    <>
      <SidebarProvider>
        <SideBarMotion>
          {/*<SidebarInset className=" p-10 ml-32 ">*/}
          <div className="flex space-x-10 mt-10">
            <div className="space-y-16">
              <LogInCard />
              <DashTimeCard />
            </div>
            {<SubjectGoalsCard />}
            <TodoListCard />
          </div>
          {/*</SidebarInset>*/}
        </SideBarMotion>
      </SidebarProvider>
    </>
  );
}
