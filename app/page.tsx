"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import SignupForm from "@/components/signup-form";
import { ModeToggle } from "@/components/ui/themetoggle";
import LoginButton from "@/components/loginbutton";
import { CardStackUsage } from "@/components/ui/cardStackUse";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
      <header className="w-full flex justify-between items-center py-4">
        <div className="flex-none">
          {" "}
          <ModeToggle />
        </div>
        <div className="flex-none ml-auto">
          {" "}
          <LoginButton />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center gap-8 py-8">
        <section className="w-full max-w-4xl text-center space-y-8">
          <div className="h-12">
            {" "}
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
          <p className="mt-4 text-xl">
            The tool to make you that straight A student. with{" "}
            <span className="text-blue-600 dark:text-blue-300 font-semibold">
              Stime.
            </span>
          </p>
        </section>

        <SignupForm />
      </main>
    </div>
  );
}
