"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a placeholder with the same dimensions during mounting
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="border-none shadow-none opacity-0"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="border-none shadow-none relative bg-transparent hover:bg-transparent" // Added these classes
    >
      <div className="relative w-[1.2rem] h-[1.2rem]">
        <Sun
          className={`absolute top-0 left-0 transition-all duration-200 ${
            theme === "dark" ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
        />
        <Moon
          className={`absolute top-0 left-0 transition-all duration-200 ${
            theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
