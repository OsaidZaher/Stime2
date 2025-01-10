"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/lib/utils";
export function CardStackUsage() {
  return (
    <div className="h-[30rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Osaid Zaher",
    designation: "Computer Science Student",
    content: (
      <p>
        This is a great idea <Highlight>Still needs some work tho</Highlight>
        In development, but I am sure it will be a good project 🙏.
      </p>
    ),
  },
  {
    id: 1,
    name: "Mohammad bin al Musk",
    designation: "Leaving Cert Student",
    content: (
      <p>
        The statistics in this website are so useful,{" "}
        <Highlight>wish this app was finished</Highlight>now I realised how much
        time<Highlight> I actually study.</Highlight>
      </p>
    ),
  },
  {
    id: 2,
    name: "Mr. Jeffrey",
    designation: "Teacher in St. Mary's",
    content: (
      <p>
        Practical website to track your study time,{" "}
        <Highlight>easy to use</Highlight> and practical for students if
        completed.
      </p>
    ),
  },
  {
    id: 3,
    name: "Osaid Zaher",
    designation: "creator of Stime",
    content: (
      <p>
        Enjoy your study time with <Highlight>Stime</Highlight> 😊
      </p>
    ),
  },
];
