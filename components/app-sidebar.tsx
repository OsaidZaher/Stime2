"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Home, BookOpen, History, Timer } from "lucide-react";

import { IconGraph, IconTestPipe } from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

const data = {
  navMain: [
    {
      title: "Stime",
      url: "#",
      className:
        "text-blue-600 dark:text-blue-300 great-vibes-regular text-3xl mt-5 ml-4 gap-y-4",
      items: [
        {
          title: "   ",
          url: "#",
          icon: null,
        },
        {
          title: "Home",
          url: "/dashboard",
          icon: Home,
        },
        {
          title: "Study Session",
          url: "/dashboard/studysession",
          icon: Timer,
          isActive: true,
        },
        {
          title: "History",
          url: "/dashboard/study-history",
          icon: History,
        },
        {
          title: "Exams",
          url: "/dashboard/calendar",
          icon: BookOpen,
        },
        {
          title: "Analytics",
          url: "/dashboard/study-graphs",
          icon: IconGraph,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className={item.className}>
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  const isActive = path === subItem.url;
                  const Icon = subItem.icon;

                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="flex items-center gap-3"
                      >
                        <a href={subItem.url}>
                          {Icon && (
                            <Icon
                              size={18}
                              className={
                                isActive ? "text-blue-600" : "text-gray-500"
                              }
                            />
                          )}
                          {subItem.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
