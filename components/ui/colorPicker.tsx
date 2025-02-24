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

    // Base theme variables
    root.style.setProperty("--theme-primary", `var(--${colorTheme}-primary)`);
    root.style.setProperty(
      "--theme-primary-lighter",
      `var(--${colorTheme}-primary-lighter)`
    );
    root.style.setProperty(
      "--theme-primary-darker",
      `var(--${colorTheme}-primary-darker)`
    );

    // Gradients
    root.style.setProperty("--theme-gradient", `var(--${colorTheme}-gradient)`);
    root.style.setProperty(
      "--theme-dark-gradient",
      `var(--${colorTheme}-dark-gradient)`
    );

    // Gradient2 variables
    root.style.setProperty(
      "--theme-gradient2",
      `var(--${colorTheme}-gradient2)`
    );
    root.style.setProperty(
      "--theme-gradient2-dark",
      `var(--${colorTheme}-gradient2-dark)`
    );

    // Color variants (50-950)
    root.style.setProperty("--theme-50", `var(--${colorTheme}-primary-50)`);
    root.style.setProperty("--theme-100", `var(--${colorTheme}-primary-100)`);
    root.style.setProperty("--theme-200", `var(--${colorTheme}-primary-200)`);
    root.style.setProperty("--theme-300", `var(--${colorTheme}-primary-300)`);
    root.style.setProperty("--theme-400", `var(--${colorTheme}-primary-400)`);
    root.style.setProperty("--theme-700", `var(--${colorTheme}-700)`);
    root.style.setProperty("--theme-950", `var(--${colorTheme}-primary-950)`);
    root.style.setProperty("--theme-800", `var(--${colorTheme}-primary-800)`);
    root.style.setProperty("--theme-600", `var(--${colorTheme}-primary-600)`);

    // Special background colors
    root.style.setProperty(
      "--theme-light-bg",
      `var(--${colorTheme}-primary-50)`
    );

    // OKLCH gradients (if using them)
    root.style.setProperty(
      "--theme-oklch-gradient",
      `var(--${colorTheme}-gradient2)`
    );
    root.style.setProperty(
      "--theme-oklch-gradient-dark",
      `var(--${colorTheme}-gradient2-dark)`
    );

    // Clean up existing color classes and add new theme
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
    {
      name: "Red",
      value: "red",
    },
    {
      name: "Orange",
      value: "orange",
    },
    {
      name: "Yellow",
      value: "yellow",
    },
    {
      name: "Blue",
      value: "blue",
    },
    {
      name: "Purple",
      value: "purple",
    },
    {
      name: "Pink",
      value: "pink",
    },
  ];

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="capitalize theme-background theme-hover text-slate-100 border-color-500 outline-color-400"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full bg-${colorTheme}-primary-400`}
              />
              Color: {colorTheme}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 border-color-500">
          <DropdownMenuLabel>Choose color theme</DropdownMenuLabel>
          {colorThemes.map((t) => (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setColorTheme(t.value)}
              className="cursor-pointer flex items-center gap-2 focus:outline-color-400 hover:bg-color-100"
            >
              <div
                className={`w-4 h-4 rounded-full bg-${t.value}-primary-400`}
              />
              <span className="capitalize">{t.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
