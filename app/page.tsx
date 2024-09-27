"use client";
import { useEffect, useState } from "react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import SignupForm from "@/components/signup-form";
import { CrousalLoop } from "@/components/carousalLoop";
import { ModeToggle } from "@/components/ui/themetoggle";
import LoginButton from "@/components/loginbutton";

export default function Home() {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        className="button-left relative top-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <LoginButton />
      </motion.div>
      <section className="mt-8">
        <section className="flex flex-col gap-4 py-6 md:py-6">
          <div className="custom-margin-right">
            <motion.div
              className="ml-44 relative top-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <ModeToggle />
            </motion.div>
            <TypewriterEffect
              words={[
                { text: "Welcome " },
                { text: "to" },
                {
                  text: "Stime.",
                  className:
                    "text-blue-600 dark:text-blue-300 great-vibes-regular",
                },
                // Test other color classes as well
              ]}
            />
          </div>

          <motion.h1
            className="ml-52"
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

        <motion.div
          className="ml-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <CrousalLoop />
        </motion.div>

        <motion.h2
          className="ml-72 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.h2>
      </section>

      <motion.div
        className="custom-margin-left  absolute top-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <SignupForm />
      </motion.div>
    </>
  );
}
