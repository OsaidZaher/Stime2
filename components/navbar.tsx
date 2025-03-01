"use client";
import { signOut, useSession } from "next-auth/react";
import { ThemeSwitcher, ThemeSwitcherButton } from "./ui/colorPicker";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
export function UserDrop() {
  const { data: session } = useSession();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          {session?.user?.image ? (
            <AvatarImage
              src={session.user.image}
              alt="User profile"
              onError={(e) => {
                e.currentTarget.src = "";
              }}
            />
          ) : null}
          <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeSwitcherButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const handleLogOut = async () => {
  try {
    await signOut({ callbackUrl: "/" });
  } catch (error) {
    console.error("failed to logout", error);
  }
};
