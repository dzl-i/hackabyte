"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import LectureItem from "@/components/LectureItem";
import NavBar from "@/components/NavBar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  const lectures = [
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Lecture 1", lastUpdated: "Uploaded 2 hours ago" },
    { title: "Lecture 2", lastUpdated: "Uploaded 3 hours ago" },
    { title: "Lecture 3", lastUpdated: "Uploaded 4 hours ago" },
    { title: "Lecture 4", lastUpdated: "Uploaded 5 hours ago" },
    { title: "Lecture 5", lastUpdated: "Uploaded 6 hours ago" },
  ];

  const [searchText, setSearchText] = useState("");

  const filterLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <NavBar />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 py-2 px-4 mt-4 ml-4 duration-200 hover:bg-white/5 rounded-lg text-white cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col w-full max-w-4xl mx-auto min-h-screen overflow-hidden p-6 py-16 gap-16">
        <div className="flex flex-row bg-[#1C1C24] w-full h-12 items-center pl-4 rounded-md gap-x-2 text-[#FFFEFD]/50">
          <Search size={16} className="text-white" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none"
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
        </div>

        <div className="space-y-2 w-full">
          {filterLectures.length > 0 ? (
            filterLectures.map((lecture, index) => (
              <LectureItem key={index} lecture={lecture} />
            ))
          ) : (
            <p className="text-md font-bold text-white">No lectures found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
