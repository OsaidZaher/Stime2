/*"use client";

import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goals } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PrismaClient } from "@prisma/client";

export function LogInCard() {
  const [streak, setStreak] = useState();
  const [target, setTarget] = useState();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/functionality/grades",{
        method: "POST",
        headers:{'Content-type': "application/json"},
        body: JSON.stringify({
          target: Number(target)
        })
      })
      if(!response.ok){
        const data = await response.json();
        throw new Error(data.error || "Failed to add target");
      }

      setOpen(false);
      
    } catch (error) {
      console.log(error)
      
    }
    
  }



  const daysLeft = Math.max(0, target - streak);

  useEffect(() => {
    setProgress((streak / target) * 100);
  }, [streak, target]);

  const getMotivationalMessage = () => {
    if (streak === target) return "Goal achieved! 🎉";
    if (streak / target >= 0.8) return "Almost there! Keep it up! 💪";
    if (streak / target >= 0.5) return "Halfway there! You're doing great! 👍";
    if (streak > 0) return "Great start! Keep going! 🚀";
    return "Start your streak today! 🌟";
  };

  const getColorClass = () => {
    if (progress >= 80) return "text-green-500";
    if (progress < 50) return "text-yellow-500";
  };


  
  

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Weekly Streak</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <Pen className="h-4 w-4" />
              <span className="sr-only">Edit goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>What is your weekly login goal?</DialogTitle>
            </DialogHeader>
            <div className="space-x-4 py-2 flex ">
              <Input
                type="number"
                onChange={(e) => setTarget(e.target.value)}
                min="1"
                max="7"
                className="w-20 border-2 border-gray-500 outline-none focus:border-4 focus:border-blue-500 rounded-md p-2 text-center"
              />
              <Button type="submit" onClick={handleSubmit}>
                Save changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            <circle
              className={`${getColorClass()} transition-all duration-500 ease-in-out`}
              strokeWidth="8"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-5xl font-bold">{streak}</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              days
            </div>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          Target: {target} days
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left to reach your goal
        </p>
        <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          {getMotivationalMessage()}
        </p>
      </CardContent>
    </Card>
  );
}

export default LogInCard;
*/
