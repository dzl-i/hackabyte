"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import LectureItem from "@/components/LectureItem";
import NavBar from "@/components/NavBar";

const lectures = [
  { id: "1", name: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
  { id: "2", name: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
  { id: "3", name: "yippee", lastUpdated: "Uploaded 1 hour ago" },
];

export default function Page() {
  const [searchText, setSearchText] = useState("");

  const memoizedLectures = useMemo(
    () =>
      lectures.filter((lecture) =>
        lecture.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [lectures, searchText]
  );

  return (
    <div>
      <NavBar />

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-h-screen overflow-hidden px-6 py-8 gap-6">
        <div className="flex flex-row bg-[#1C1C24] w-full h-12 items-center pl-4 rounded-md gap-x-2 text-[#FFFEFD]/50">
          <Search size={16} className="text-white" />
          <input
            className="w-full outline-none"
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          {memoizedLectures.map((lecture, index) => (
            <LectureItem key={index} lecture={lecture} />
          ))}
        </div>
      </div>
    </div>
  );
}
