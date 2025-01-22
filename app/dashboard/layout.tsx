import { ModeToggle } from "@/components/ui/themetoggle";
import { SideBar } from "@/components/sidebar";
import { UserDrop, NotificationBell } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        {/* Left-aligned "Stime" */}
        <h1 className="text-blue-600 dark:text-blue-300 great-vibes-regular text-3xl ml-2 mt-2">
          Stime
        </h1>

        {/* Right-aligned components with consistent spacing */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <NotificationBell />
          <UserDrop />
        </div>
      </div>
      <div className="flex flex-grow">
        <SideBar />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
