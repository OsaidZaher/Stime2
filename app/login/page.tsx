"use client"; // Ensures this is a client-side component
import { useEffect } from "react";
import LoginForm from "@/components/loginform";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/ui/themetoggle";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // You can handle delayed state or actions here if needed
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="mt-14">
        <section className="flex flex-col gap-10 md:py-6">
          <div className="">
            <motion.div
              className="ml-96 relative top-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <ModeToggle />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <TypewriterEffect
                words={[
                  { text: "Already " },
                  { text: "have" },
                  { text: "an" },
                  {
                    text: "Account",
                    className: "text-blue-600 dark:text-blue-300 ",
                  },
                  {
                    text: "?",
                    className: "text-blue-600 dark:text-blue-300 ",
                  },
                ]}
              />
            </motion.div>
          </div>
          <motion.div
            className=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <LoginForm />
          </motion.div>
        </section>
      </section>
    </>
  );
}
