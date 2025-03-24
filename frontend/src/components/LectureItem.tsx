"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type Lecture = {
  id: string;
  name: string;
  lastUpdated: string;
};

function LectureItem({ lecture }: { lecture: Lecture }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/lectures/${lecture.id}`)}
      className="flex flex-col text-left bg-[#262934] hover:bg-[#1c1e27] cursor-pointer duration-200 w-full py-3 px-4 gap-y-1 rounded-md"
    >
      <p className="text-md font-bold text-white">{lecture.name}</p>
      <p className="text-sm text-zinc-500">{lecture.lastUpdated}</p>
    </button>
  );
}

export default LectureItem;
