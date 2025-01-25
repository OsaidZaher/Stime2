import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
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
          title: "Calendar",
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
  return (
    <Sidebar {...props}>
      <SidebarContent>
        {/* Render each parent group */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {/* Apply inline styles from the style property */}
            <SidebarGroupLabel className={item.className}>
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
