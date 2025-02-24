import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SideBar() {
  return (
    <SidebarProvider>
      <AppSidebar className="border-color-100" />
      <SidebarInset>
        <header className="flex h-1 shrink-0 items-center  px-4">
          <SidebarTrigger className="-mr-4 text-500" />
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
