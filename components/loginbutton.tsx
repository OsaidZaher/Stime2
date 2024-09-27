"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/moving-border";
export default function LoginButton() {
  return (
    <Link href="/login">
      <Button
        borderRadius="1rem"
        className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold"
      >
        Login
      </Button>
    </Link>
  );
}
