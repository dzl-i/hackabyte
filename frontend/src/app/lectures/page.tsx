import React from "react";
import { Search } from "lucide-react";
import LectureItem from "@/components/LectureItem";

function page() {
  const lectures = [
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
  ];

  return (
    <div className="flex flex-col justify-center w-full max-w-xl mx-auto min-h-screen overflow-hidden p-6 py-16 gap-16">
      <div className="flex flex-row bg-[#1C1C24] w-full h-12 items-center pl-4 rounded-md gap-x-2 text-[#FFFEFD]/50">
        <Search size={16} className="text-white" /> Search...
      </div>

      <div className="space-y-2 w-full">
        {lectures.map((lecture, index) => (
          <LectureItem key={index} lecture={lecture} />
        ))}
      </div>
    </div>
  );
}

export default page;
