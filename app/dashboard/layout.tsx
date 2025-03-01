import { ModeToggle } from "@/components/ui/themetoggle";
import SideBar from "@/components/sidebar";
import { UserDrop } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-end p-4 ">
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserDrop />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <aside>
          <SideBar />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
