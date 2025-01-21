"use client";

import { useRouter } from "next/navigation";

import React, { FormEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconBrandFacebook } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export default function SignupPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-white dark:bg-black rounded-lg p-6 shadow-lg max-w-lg w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          &times;
        </button>

        {/* Signup Form */}
        <SignupForm />
      </div>
    </div>
  );
}
function SignupForm() {
  const router = useRouter();

  const [passwordError, setPasswordError] = useState<string | null>(null); // To track password validation error
  const [formError, setFormError] = useState<string | null>(null); // To track form validation error

  const handleOAuthSignIn = async (
    provider: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault;

    try {
      const res = signIn(provider, {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("failed to sign in from:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);

    // Validate that all fields are filled in
    const firstname = formData.get("firstname")?.toString().trim();
    const lastname = formData.get("lastname")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    // Check if any field is empty
    if (!firstname || !lastname || !email || !password) {
      setFormError("Please fill in all fields before submitting.");
      return; // Stop form submission if any field is empty
    } else {
      setFormError(null); // Clear form error if all fields are filled
    }

    // Password validation criteria
    const passwordRequirements =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Check if password meets the criteria
    if (!passwordRequirements.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return; // Stop form submission if the password doesn't meet the criteria
    } else {
      setPasswordError(null); // Clear the error if the password is valid
    }

    // Create data object to send to backend
    const data = {
      name: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };

    // Try submitting the form data
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Check for success or specific errors
      if (res.ok) {
        console.log("Registration Successful", result);
        router.push("/dashboard");
      } else {
        if (result.error === "Email already registered") {
          setFormError(
            "This email is already registered. Please log in or use a different email."
          );
        } else {
          setFormError("Failed to register. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setFormError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-xl p-4 md:p-8 shadow-input bg-white dark:bg-black ">
      <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200 mb-2">
        Join{" "}
        <span className="text-blue-600 dark:text-blue-400 great-vibes-regular">
          Stime
        </span>
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mx-auto mb-8 dark:text-neutral-300">
        Sign up to start your{" "}
        <span className="text-blue-600 dark:text-blue-400 font-semibold">
          Stime
        </span>{" "}
        journey!
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-left block mb-2">
              First name
            </Label>
            <Input
              id="firstname"
              placeholder="Name"
              type="text"
              name="firstname"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastname" className="text-left block mb-2">
              Last name
            </Label>
            <Input
              id="lastname"
              placeholder="Last Name"
              type="text"
              name="lastname"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-left block mb-2">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="name@gmail.com"
            type="email"
            name="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-left block mb-2">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="password"
            className={passwordError ? "border-red-500 outline-red-500" : ""}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
          )}
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] outline-none"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
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
