"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { ModeToggle } from "@/components/ui/themetoggle";
import LoginButton from "@/components/loginbutton";
import LoginForm from "@/components/loginform";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow flex flex-row h-screen">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Welcome section - increased margin bottom from mb-12 to mb-24 */}
          <section className="text-center space-y-4 mb-24">
            {" "}
            {/* Changed this line */}
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
              The tool to make you that straight A student.
            </p>
          </section>

          {/* Login form section */}
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-slate-100 dark:bg-slate-950  min-h-screen rounded-md">
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
        </div>
      </main>
    </div>
  );
}
