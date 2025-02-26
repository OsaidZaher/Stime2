"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_THEME = "blue";

const ColorThemeContext = createContext({
  colorTheme: DEFAULT_THEME,
  setColorTheme: (theme: string) => {},
  isThemeLoaded: false,
});

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start with default theme for SSR
  const [colorTheme, setColorTheme] = useState<string>(DEFAULT_THEME);
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorTheme");
    if (savedTheme) {
      setColorTheme(savedTheme);
    }
    setIsThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!isThemeLoaded) return;

    localStorage.setItem("colorTheme", colorTheme);

    const root = document.documentElement;

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

    root.style.setProperty(
      "--theme-light-bg",
      `var(--${colorTheme}-primary-50)`
    );

    root.style.setProperty(
      "--theme-oklch-gradient",
      `var(--${colorTheme}-gradient2)`
    );
    root.style.setProperty(
      "--theme-oklch-gradient-dark",
      `var(--${colorTheme}-gradient2-dark)`
    );

    // Remove all theme classes and add the current one
    const themeClasses = ["red", "orange", "yellow", "blue", "purple", "pink"];
    themeClasses.forEach((cls) => {
      document.body.classList.remove(cls);
    });
    document.body.classList.add(colorTheme);
  }, [colorTheme, isThemeLoaded]);

  return (
    <ColorThemeContext.Provider
      value={{ colorTheme, setColorTheme, isThemeLoaded }}
    >
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

// Fixed version for use in the dropdown menu
export function ThemeSwitcherButton() {
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
    <>
      <DropdownMenuLabel>Choose your Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {colorThemes.map((theme) => (
        <DropdownMenuItem
          key={theme.value}
          onClick={() => setColorTheme(theme.value)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2 w-full">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `var(--${theme.value}-primary)` }}
            />
            <span>{theme.name}</span>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
}

// Standalone version for direct use
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
            className="capitalize bg-white w-full theme-hover dark:text-slate-100 border-none"
          >
            <div className="flex items-center gap-2">Choose your theme</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Choose your Theme</DropdownMenuLabel>
          {colorThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => setColorTheme(theme.value)}
              className="cursor-pointer flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `var(--${theme.value}-primary)` }}
              />
              <span>{theme.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
