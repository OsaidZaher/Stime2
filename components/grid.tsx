import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { IconClock, IconBook, IconCalendar } from "@tabler/icons-react";
import {
  SubjectContent,
  HoursStudyContent,
  DemoChart,
  CalendarDemo,
} from "./ui/dashboard_content";

export function Grid() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
          link={item.link}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
const items = [
  {
    title: "Your most studied subject!",
    description: "You spent the most hours studying this subject this month!",
    header: <SubjectContent />,
    className: "md:col-span-2",
    icon: <IconBook className="h-4 w-4 text-neutral-500" />,
    link: "/dashboard/demoDashboard",
  },
  {
    title: "Hours of Studying!",
    description: "This is how many hours you have studied this month!",
    header: <HoursStudyContent />,
    className: "md:col-span-1",
    icon: <IconClock className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Analytics",
    description: "",
    header: <DemoChart />,
    className: "md:col-span-1",
    icon: <IconClock className="h-10 w-4 text-neutral-500" />,
  },
  {
    title: "Upcoming Exams",
    description: "Start studying before your exams are too close",
    header: <Skeleton />,
    className: "md:col-span-2 ",
    icon: <IconCalendar className="h-4 w-4 text-neutral-500" />,
  },
];
