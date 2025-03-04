"use client";

import React from "react";
import { useSidebar } from "./sidebar";

export function SideBarMotion({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  // Replace the console.log that was using 'open' with 'state'
  console.log("Sidebar state:", state);

  return (
    <>
      <div
        className={`${
          state === "collapsed" ? "ml-32" : "mr-24"
        } w-full transition-all duration-500`}
      >
        {children}
      </div>
    </>
  );
}
export function SideBarMotion2({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  return (
    <div className={`${!open ? `ml-40` : ` ml-0`} w-full`}>{children}</div>
  );
}
