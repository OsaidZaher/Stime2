"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandFacebook, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import SignupPopup from "./signup-form";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // Track login errors
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setError(null); // Reset error state before attempting to login

    const result = await signIn("credentials", {
      redirect: false, // Set to false to handle errors manually
      email,
      password,
    });

    if (result?.error) {
      if (result.status === 401) {
        setError("Wrong email or password. Please try again.");
      } else if (result.status === 404) {
        setError("User does not exist. Please check the email or sign up.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } else {
      router.push("/dashboard"); // Redirect to dashboard on success
    }
  };

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-3xl p-4 md:p-8 shadow-input dark:bg-black dark:border-transparent bg-white border border-b-slate-200">
      <h2 className="font-bold text-neutral-800 dark:text-neutral-200 text-2xl">
        Login to{" "}
        <span className="text-blue-600 dark:text-blue-300 great-vibes-regular font-bold text-3xl">
          Stime
        </span>
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="name@gmail.com"
            type="email"
            name="email"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="password"
          />
        </LabelInputContainer>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>

        <div className="mt-3 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors font-semibold mr-2"
            onClick={() => setShowPopup(true)} // Show the pop-up
          >
            Don't have an account? Create one
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 bg-white relative group/btn hover:bg-gray-50 transition-all duration-300"
              onClick={() => handleOAuthSignIn("google")}
              type="button"
            >
              <div className="h-5 w-5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <SignupPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
