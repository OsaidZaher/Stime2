import { ModeToggle } from "@/components/ui/themetoggle";
import { SideBar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>
      <div className="flex flex-grow">
        <SideBar />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
