import { Card } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";

export default function DashTimeCard() {
  return (
    <Card className=" overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 p-4 shadow-md h-[155px]">
      <div className=" flex items-center gap-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 mt-[15px]">
          <ClockIcon className="h-12 w-12 text-white " strokeWidth={2} />
        </div>
        <div className="flex flex-col mt-4">
          <span className="text-xl font-bold text-black text-center">
            Hours Studied
          </span>
          <span className="text-4xl font-bold text-blue-600 text-center">
            1.3hrs
          </span>
        </div>
      </div>
    </Card>
  );
}
