"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ColorThemeContext = createContext({
  colorTheme: "blue",
  setColorTheme: (theme) => {},
});

export function ColorThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState("blue");

  useEffect(() => {
    const root = document.documentElement;

    // Set all theme-related CSS variables
    root.style.setProperty("--theme-primary", `var(--${colorTheme}-primary)`);
    root.style.setProperty(
      "--theme-primary-darker",
      `var(--${colorTheme}-primary-darker)`
    );
    root.style.setProperty("--theme-gradient", `var(--${colorTheme}-gradient)`);
    root.style.setProperty(
      "--theme-dark-gradient",
      `var(--${colorTheme}-dark-gradient)`
    );
    // Add the new light background variable
    root.style.setProperty(
      "--theme-light-bg",
      `var(--${colorTheme}-primary-50)`
    );

    document.body.className = document.body.className
      .split(" ")
      .filter((cls) => !cls.match(/^(red|orange|yellow|blue|purple|pink)$/))
      .concat(colorTheme)
      .join(" ");
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}

export function ThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();

  const colorThemes = [
    { name: "Red", value: "red" },
    { name: "Orange", value: "orange" },
    { name: "Yellow", value: "yellow" },
    { name: "Blue", value: "blue" },
    { name: "Purple", value: "purple" },
    { name: "Pink", value: "pink" },
  ];

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="capitalize theme-background theme-hover text-slate-100"
          >
            Color: {colorTheme}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Choose color theme</DropdownMenuLabel>
          {colorThemes.map((t) => (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setColorTheme(t.value)}
              className="cursor-pointer"
            >
              <span className="capitalize">{t.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
