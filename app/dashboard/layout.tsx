import { ModeToggle } from "@/components/ui/themetoggle";
import { UserDrop } from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="w-full">
      <AppSidebar className="  border border-color-100" />
      <SidebarInset>
        <header className="flex items-center justify-between p-4">
          <SidebarTrigger className="text-500" />
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserDrop />
          </div>
        </header>
        <main className="flex-1 p-6  mx-auto w-full ">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
