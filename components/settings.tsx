"use client";

import { useState, useEffect } from "react";
import { Stopwatch, Timer } from "./clock";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SwitchProps {
  isTimer: boolean;
  start: boolean;
  onReset: () => void;
}

export function Switch({ isTimer, start, onReset }: SwitchProps) {
  return (
    <div>
      {isTimer ? (
        <Timer startTimer={start} onReset={onReset} />
      ) : (
        <Stopwatch startStopwatch={start} onReset={onReset} />
      )}
    </div>
  );
}

export function Alaram() {}

export function Break() {}
