"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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

const data = {
  navMain: [
    {
      title: "Stime",
      url: "#",
      className:
        "text-blue-600 dark:text-blue-300 great-vibes-regular text-3xl mt-5 ml-4 gap-y-4", // Add the classes here
      items: [
        {
          title: "   ",
          url: "#",
        },
        {
          title: "Home",
          url: "/dashboard",
        },
        {
          title: "Study Session",
          url: "/dashboard/studysession",
          isActive: true,
        },
        {
          title: "History",
          url: "/dashboard/study-history",
        },
        {
          title: "Exams",
          url: "/dashboard/calendar",
        },
        {
          title: "Analytics",
          url: "/dashboard/study-graphs",
        },
        {
          title: "Discord",
          url: "#",
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

                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={subItem.url}>{subItem.title}</a>
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
