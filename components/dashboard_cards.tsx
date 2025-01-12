"use client";
import * as React from "react";
import { WobbleCard } from "./ui/wobble-card";

import {
  CardDescription,
  CardFooter,
  CardTitle,
  Card,
  CardHeader,
  CardContent,
} from "./ui/card";

import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";

export function WeekCounter() {
  return (
    <Card className="w-[300px] mr-[1100px] h-[100px]">
      <CardHeader>
        <CardTitle>The days you have logged in this week!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mr-6 space-x-2 flex">
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
          <StarIcon className="w-6 h-6 text-yellow-500" />
        </div>
      </CardContent>
    </Card>
  );
}
export function faultyfunction() {
  return (
    <WobbleCard className="w-80 h-60 mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Logged in Days</h3>
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(7)].map((_, index) => (
            <StarIcon key={index} className="w-5 h-5 text-yellow-500" />
          ))}
        </div>
      </div>
    </WobbleCard>
  );
}
