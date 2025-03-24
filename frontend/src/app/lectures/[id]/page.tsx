"use client";

import NavBar from "@/components/NavBar";
import { ArrowLeft, Captions, Heart, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FlashCard from "@/components/FlashCard";

export type LectureTabs = {
  name: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

const flashcards = [
  { question: "how is merry's mental state?", answer: "not good" },
  { question: "how is merry's mental state?", answer: "not good" },
  { question: "how is merry's mental state?", answer: "not good" },
];

const lectureTabs = [
  {
    name: "Summary",
    icon: Heart,
    content: <p className="text-white">Summary</p>,
  },
  {
    name: "Transcript",
    icon: Captions,
    content: <p className="text-white">Transcript</p>,
  },
  {
    name: "Flashcards",
    icon: Layers,
    content: (
      <div className="px-4">
        <h4 className="text-lg font-bold text-white mb-4">Flashcards</h4>

        <div className="space-y-4">
          {flashcards.map((flashcard, index) => (
            <FlashCard
              key={index}
              question={flashcard.question}
              answer={flashcard.answer}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export default function Page() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(lectureTabs[0]);

  return (
    <main>
      <NavBar />
      <main className="p-6 flex gap-8">
        {/* List of sections */}
        <section className="space-y-6 flex-1 min-w-[220px]">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 py-2 px-4 duration-200 hover:bg-white/5 rounded-lg text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="max-w-xs space-y-2">
            <p className="text-white/75 font-bold uppercase">Sections</p>
            <div className="flex flex-col gap-1">
              <button className="text-white cursor-pointer text-left text-ellipsis font-bold py-2 px-4 duration-200 bg-[rgba(32,_33,_42,_1)] rounded-lg">
                Rule & Act Utilitarianism
              </button>
              <button className="text-white cursor-pointer text-left text-ellipsis py-2 px-4 duration-200 hover:bg-white/5 rounded-lg">
                Rule & Act Utilitarianism
              </button>
            </div>
          </div>
        </section>
        <section className="space-y-4 w-full">
          <h1 className="text-white font-bold text-2xl">
            Rule & Act Utilitarianism
          </h1>
          <div className="flex gap-2">
            {lectureTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setSelectedTab(tab)}
                className={`flex justify-center items-center gap-2 text-white px-4 py-2 relative cursor-pointer overflow-clip rounded-lg ${
                  selectedTab.name === tab.name
                    ? "bg-[rgba(32,_33,_42,_1)]"
                    : "hover:bg-[rgba(32,_33,_42,_1)]"
                } duration-200`}
              >
                <tab.icon className="h-4 w-4" /> {tab.name}
              </button>
            ))}
          </div>

          {selectedTab.content}
        </section>
      </main>
    </main>
  );
}
