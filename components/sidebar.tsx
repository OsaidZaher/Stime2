"use client";
import React, { useState, useEffect } from "react";
import { IconBrandDiscord } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHome,
  IconRobot,
  IconBook2,
  IconClock,
  IconGraph,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/themetoggle";
export function SideBar() {
  const [showLogo, setShowLogo] = useState(false);
  const [open, setOpen] = useState(false);

  // Toggle logo visibility when the sidebar is open
  useEffect(() => {
    if (open) {
      setShowLogo(true); // Show logo when sidebar is opened
    } else {
      setShowLogo(false); // Hide logo when sidebar is closed
    }
  }, [open]);

  const links = [
    {
      label: "Home",
      href: "/dashboard",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Study Session",
      href: "/dashboard/studysession",
      icon: (
        <IconBook2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "ChatBot",
      href: "#",
      icon: (
        <IconRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "#",
      icon: (
        <IconGraph className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Discord",
      href: "#",
      icon: (
        <IconBrandDiscord className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <>
      {/* Sidebar component */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10  h-screen rounded-lg ">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Show logo only when showLogo is true */}
            {showLogo && (
              <div className="text-blue-600 dark:text-blue-300 great-vibes-regular font-bold text-3xl">
                Stime
              </div>
            )}

            {/* Sidebar links */}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* User avatar link */}
          <div>
            <SidebarLink
              link={{
                label: "Osaid Zaher",
                href: "#",
                icon: (
                  <Image
                    src="/toji.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={75}
                    height={100}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
}
