"use client";

import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconHome,
  IconBook2,
  IconGraph,
  IconHistory,
  IconCalendar,
} from "@tabler/icons-react";
import Image from "next/image";
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

  const handleLogOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("failed to logout", error);
    }
  };

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
      label: "Analytics",
      href: "/dashboard/study-graphs",
      icon: (
        <IconGraph className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: (
        <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },

    {
      label: "History",
      href: "/dashboard/study-history",
      icon: (
        <IconHistory className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      onClick: handleLogOut,
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Github",
      href: "https://github.com/OsaidZaher",
      icon: (
        <IconBrandGithub className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
                label: "User",
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
