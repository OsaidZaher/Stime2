"use client";

import { useEffect, useState } from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import SignupForm from "@/components/signup-form";
import { ModeToggle } from "@/components/ui/themetoggle";
import LoginButton from "@/components/loginbutton";
import { CardStackUsage } from "@/components/ui/cardStackUse";

export default function Home() {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
      <header className="w-full flex justify-between items-center py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <LoginButton />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <ModeToggle />
        </motion.div>
      </header>

      <main className="flex-grow flex flex-col items-center gap-8 py-8">
        {/* Welcome Section */}
        <section className="w-full max-w-4xl text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl"
          >
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
          </motion.div>

          <motion.h1
            className="text-base sm:text-lg md:text-xl lg:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            The tool to make you that straight A student. Track your study time
            with{" "}
            <span className="text-blue-600 dark:text-blue-300 font-semibold">
              Stime.
            </span>
          </motion.h1>
        </section>

        {/* Content Section */}
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-start">
          {/* Carousel */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <CardStackUsage />
          </motion.div>

          {/* Signup Form */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <SignupForm />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
