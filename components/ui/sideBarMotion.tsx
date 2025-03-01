"use client";

import React from "react";
import { useSidebar } from "./sidebar";

export function SideBarMotion({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <>
      <div className={`${open ? "ml-32" : `ml-0`}`}>{children}</div>
    </>
  );
}
