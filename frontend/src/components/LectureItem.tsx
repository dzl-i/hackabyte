import { useRouter } from "next/navigation";
import React from "react";

export type Lecture = {
  id: string;
  title: string;
  createdAt: string;
};

function LectureItem({ lecture }: { lecture: Lecture }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/lectures/${lecture.id}`)}
      className="flex flex-col bg-[#262934] hover:bg-[#1c1e27] duration-200 text-left w-full py-3 px-4 gap-y-1 rounded-md"
    >
      <p className="text-md font-bold text-white">{lecture.title}</p>
      <p className="text-sm text-zinc-500">
        Updated at {new Date(lecture.createdAt).toLocaleString()}
      </p>
    </button>
  );
}

export default LectureItem;
