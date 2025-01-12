"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cardwithwobble";

export default function StreakStars() {
  return (
    <Card className="w-[350px] border-2 border-blue-300 h-30">
      <CardHeader>
        <CardTitle className="text-2xl">Days logged in!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex text-left items-center gap-2">
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
          <StarIcon className="w-8 h-8 text-yellow-500" />
        </div>
      </CardContent>
    </Card>
  );
}
