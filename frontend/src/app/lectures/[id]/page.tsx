// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import NavBar from "@/components/NavBar";
import {
  ArrowLeft,
  Captions,
  Heart,
  Layers,
  Download,
  CirclePlay,
  CirclePause,
  Loader,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import FlashCard from "@/components/FlashCard";
import { handleDownload, truncate } from "@/helpers";
import useQuery from "@/hooks/useRequest";

export default function Page() {
  // BACKEND CONNECTION
  const router = useRouter();
  const params = useParams();

  // GET DATA FROM BACKEND
  const { data, error, isLoading } = useQuery(`/lecture/${params.id}`);

  // STATE INITIALISATION - Topic Section and tab state
  const [topicTab, setTopicTab] = useState(data ? data.sections[0] : undefined);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // AUDIO
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const getCurrentTabText = () => {
    if (selectedTabIndex === 0) {
      return topicTab.summary;
    } else if (selectedTabIndex === 1) {
      return JSON.parse(topicTab?.transcript)
        .map((t) => t.text)
        .join(" ");
    }
    return "";
  };

  const handleTTS = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(getCurrentTabText());
    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
    };
  };

  useEffect(() => {
    stopSpeech(); // Stop speech when switching tab
  }, [selectedTabIndex]);

  useEffect(() => {
    if (data) {
      setTopicTab(data.sections[0]);
    }
  }, [data]);

  const audioButton = () => {
    return (
      <button
        onClick={handleTTS}
        className="flex items-center gap-2 py-1 px-3 duration-200 hover:bg-white/5  rounded-lg text-white cursor-pointer"
      >
        {isSpeaking ? (
          <>
            <CirclePause className="w-4 h-4" />
            Pause Audio
          </>
        ) : (
          <>
            <CirclePlay className="w-4 h-4" />
            Play Audio
          </>
        )}
      </button>
    );
  };

  // LECTURE TAB
  const lectureTabs = [
    {
      name: "Summary",
      icon: Heart,
      content: (
        <div className="px-4">
          <div className="flex items-center mb-4 gap-2">
            <h4 className="text-lg font-bold text-white">Summary</h4>
            {audioButton()}
          </div>

          <p className="text-white">{topicTab?.summary}</p>
        </div>
      ),
    },
    {
      name: "Transcript",
      icon: Captions,
      content: (
        <div className="px-4">
          <div className="flex items-center mb-4 gap-2">
            <h4 className="text-lg font-bold text-white">Transcript</h4>
            {audioButton()}
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2">
            {topicTab &&
              JSON.parse(topicTab?.transcript)?.map((t, index) => (
                <React.Fragment key={index}>
                  <p className="text-gray-400 font-mono">[{t.timestamp}]</p>
                  <p className="text-white">{t.text}</p>
                </React.Fragment>
              ))}
          </div>
        </div>
      ),
    },
    {
      name: "Flashcards",
      icon: Layers,
      content: (
        <div className="px-4">
          <h4 className="text-lg font-bold text-white mb-4">Flashcards</h4>

          <div className="space-y-4">
            {topicTab?.flashcards?.map((flashcard, index) => (
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

  // Give the details of currently selected lecture tab
  const selectedTab = lectureTabs[selectedTabIndex];

  return (
    <main>
      {!topicTab && isLoading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <Loader className="w-10 h-10 text-white animate-spin" />
        </div>
      ) : (
        <>
          <NavBar />
          <main className="p-6 flex gap-8">
            {/* Sidebar: Topics */}
            <section className="space-y-6 flex-1 min-w-[280px]">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 py-2 px-4 duration-200 hover:bg-white/5 rounded-lg text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="max-w-xs space-y-2">
                <p className="text-white/75 font-bold uppercase">Sections</p>
                <div className="flex flex-col gap-1">
                  {data.sections?.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        stopSpeech();
                        setTopicTab(section);
                      }}
                      className={`flex gap-2 px-4 py-2 rounded-lg duration-200 ${
                        topicTab?.id === section.id
                          ? "bg-[rgba(32,_33,_42,_1)] text-white font-bold"
                          : "text-gray-400 hover:text-white hover:bg-[rgba(32,_33,_42,_1)]"
                      }`}
                    >
                      <p>{truncate(section.title)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Main Panel */}
            <section className="space-y-4 w-full">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-white font-bold text-2xl">
                  {topicTab?.title}
                </h1>
                <button
                  onClick={() => handleDownload(sections)}
                  className="flex items-center gap-2 py-2 px-4 duration-200 hover:bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download All Sections
                </button>
              </div>

              <div className="flex gap-2">
                {lectureTabs.map((tab, index) => (
                  <button
                    key={tab.name}
                    onClick={() => setSelectedTabIndex(index)}
                    className={`flex justify-center items-center gap-2 px-4 py-2 rounded-lg duration-200 ${
                      selectedTabIndex === index
                        ? "bg-[rgba(32,_33,_42,_1)] text-white"
                        : "text-gray-400 hover:text-white hover:bg-[rgba(32,_33,_42,_1)]"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" /> {tab.name}
                  </button>
                ))}
              </div>
              {selectedTab.content}
            </section>
          </main>
        </>
      )}
    </main>
  );
}
