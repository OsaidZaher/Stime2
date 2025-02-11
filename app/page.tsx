"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { ModeToggle } from "@/components/ui/themetoggle";
import LoginForm from "@/components/loginform";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-row h-screen">
        <div className="w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <section className="text-center space-y-4 mb-24">
            <div className="h-12">
              <TypewriterEffect
                words={[
                  { text: "Welcome " },
                  { text: "to" },
                  {
                    text: "Stime.",
                    className:
                      "text-blue-600 dark:text-blue-300 great-vibes-regular",
                  },
                ]}
              />
            </div>
            <p className="text-xl">
              The tool to make you that straight-A student.
            </p>
          </section>

          {/* Login form section */}
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-slate-100 dark:bg-slate-950 min-h-screen rounded-md relative">
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>

          {/* Centered Card */}
          <div className=" mt-[450px] inset-0 flex items-center justify-center">
            <Card className="max-w-md bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-amber-800">
                    Hi 👋, App is under development.🙃
                  </p>
                </div>
                <p className="mt-2 text-sm text-amber-700">
                  Please create an account as app needs verification by Google.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
