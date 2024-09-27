import { ModeToggle } from "@/components/ui/themetoggle";
import { SideBar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Flexbox to position the ModeToggle on the right */}
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>
      <div className=" h-screen">
        <SideBar />
      </div>

      {/* Main content */}
      <div>{children}</div>
    </div>
  );
}
