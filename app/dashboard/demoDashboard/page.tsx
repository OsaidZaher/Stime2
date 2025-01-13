"use client";

import * as React from "react";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StarsCard() {
  const totalStars = 7; // Customize total stars here

  return (
    <Card className="w-[500px] border border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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
          you have x days until you hit goal!
        </span>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800">
          Change target
        </button>
      </CardFooter>
    </Card>
  );
}
