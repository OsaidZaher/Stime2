"use client";

import * as React from "react";
import { useState } from "react";
import { StarIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function StarsCard() {
  const totalStars = 7;
  const [weeklyGoal, setWeeklyGoal] = useState(1);
  const [tempGoal, setTempGoal] = useState(weeklyGoal);
  const [isOpen, setIsOpen] = useState(false);

  const incrementGoal = () => {
    if (tempGoal < 7) setTempGoal(tempGoal + 1);
  };

  const decrementGoal = () => {
    if (tempGoal > 1) setTempGoal(tempGoal - 1);
  };

  const handleSave = () => {
    setWeeklyGoal(tempGoal);
    setIsOpen(false);
  };

  const handleDropdownOpen = (open) => {
    setIsOpen(open);
    if (open) {
      setTempGoal(weeklyGoal); // Reset temp goal when opening
    }
  };

  return (
    <Card className="w-[500px] border border-blue-200 dark:border-blue-900 bg-white dark:bg-black rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Days Logged In!
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Track your progress and keep the streak alive!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalStars }).map((_, index) => (
            <StarIcon
              key={index}
              className="w-8 h-8 text-yellow-500 transition-transform transform hover:scale-125"
              role="img"
              aria-label={`Star ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-m text-gray-600 dark:text-gray-400">
          You have {7 - weeklyGoal} days until you hit your goal!
          {if (weeklyGoal==0{
            "You have hit your goal!"
          })}
        </span>
        <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-300 dark:bg-blue-900" variant="outline">
              Change target
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Change weekly login goal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decrementGoal}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Decrease weekly goal"
                  >
                    &larr;
                  </button>
                  <input
                    type="text"
                    value={tempGoal}
                    readOnly
                    className="w-12 text-center border rounded"
                    aria-label="Weekly goal value"
                  />
                  <button
                    onClick={incrementGoal}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Increase weekly goal"
                  >
                    &rarr;
                  </button>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-blue-500 text-white hover:bg-blue-300 cursor-pointer"
              onSelect={handleSave}
            >
              Save Changes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
