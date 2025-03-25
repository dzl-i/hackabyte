import React from "react";

export type Lecture = {
  title: string;
  lastUpdated: string;
};

function LectureItem({ lecture }: { lecture: Lecture }) {
  return (
    <div className="flex flex-col bg-[#262934] hover:bg-[#1c1e27] duration-200 w-full py-3 px-4 gap-y-1 rounded-md">
      <p className="text-md font-bold text-white">{lecture.title}</p>
      <p className="text-sm text-zinc-500">{lecture.lastUpdated}</p>
    </div>
  );
}

export default LectureItem;
