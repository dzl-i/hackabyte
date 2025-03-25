// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import NavBar from "@/components/NavBar";
import { ArrowLeft, Captions, Heart, Layers, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import FlashCard from "@/components/FlashCard";
import { jsPDF } from "jspdf";

export default function Page() {
  const router = useRouter();
  const id = useParams().id;
  // const [sections, setSections] = useState([]);

  const getSections = async () => {
    try {
      const res = await fetch(`/lecture/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log("data " + data);
      // setSections(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 15;

    const renderParagraphs = (text: string) => {
      const paragraphs = text.split("\n");
      paragraphs.forEach((para) => {
        const lines = doc.splitTextToSize(para, 180);
        doc.text(lines, 16, y);
        y += lines.length * 6 + 4;
      });
    };

    sections.forEach((section, idx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Section ${idx + 1}: ${section.title}`, 10, y);
      y += 10;

      // Summary
      doc.setFontSize(12);
      doc.text("Summary", 12, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      renderParagraphs(section.summary);

      // Transcript
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Transcript", 12, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      section.transcripts.forEach((t: { timestamp: string; text: string }) => {
        const timestamp = `[${t.timestamp}]`;
        const textLines = doc.splitTextToSize(t.text, 160); // reserve space for timestamp
        doc.text(timestamp, 16, y);
        doc.text(textLines, 35, y); // indent text to align
        y += textLines.length * 6 + 2;
      });

      y += 5;

      // Flashcards
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Flashcards", 12, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      section.flashcards.forEach(
        (fc: { question: string; answer: string }, idx: number) => {
          const q = `Question ${idx + 1}: ${fc.question}`;
          const a = `Answer: ${fc.answer}`;
          doc.text(doc.splitTextToSize(q, 180), 16, y);
          y += 6;
          doc.text(doc.splitTextToSize(a, 180), 16, y);
          y += 10;
        }
      );

      y += 7;

      // Add new page if near bottom
      if (y > 260 && idx < sections.length - 1) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save("download.pdf");
  };

  // DATABASE
  const flashcardsDummy = [
    { question: "how is merry's mental state?", answer: "not good" },
    { question: "how is merry's mental state?", answer: "not good" },
    { question: "how is merry's mental state?", answer: "not good" },
  ];

  const summaryDummy =
    "Utilitarianism is a consequentialist ethical theory that holds the view that the morality of an action is determined by its outcomes—specifically, the extent to which it promotes overall happiness or minimizes suffering...";

  const transcriptsDummy = [
    {
      timestamp: "00:01",
      text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
    },
    {
      timestamp: "00:01",
      text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
    },
    {
      timestamp: "200:01",
      text: "Okay, so… Utilitarianism is what we call a consequentialist ethical theory.",
    },
  ];

  const transcriptsDummy2 = [
    {
      timestamp: "00:01",
      text: "Test",
    },
  ];

  const sections = [
    {
      title: "Rule & Act Utilitarianism",
      summary: summaryDummy,
      transcripts: transcriptsDummy,
      flashcards: flashcardsDummy,
    },
    {
      title: "Rule & Act Utilitarianism 2",
      summary: "different one\n trust",
      transcripts: transcriptsDummy2,
      flashcards: flashcardsDummy,
    },
  ];

  // Section and tab state
  const [topicTab, setTopicTab] = useState(sections[0]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Dynamically generates lecture type tab
  const lectureTabs = [
    {
      name: "Summary",
      icon: Heart,
      content: (
        <div className="px-4">
          <h4 className="text-lg font-bold text-white mb-4">Summary</h4>
          <p className="text-white">{topicTab.summary}</p>
        </div>
      ),
    },
    {
      name: "Transcript",
      icon: Captions,
      content: (
        <div className="px-4">
          <h4 className="text-lg font-bold text-white mb-4">Transcript</h4>
          <div className="grid grid-cols-[80px_1fr] gap-y-2">
            {topicTab.transcripts.map((transcript, index) => (
              <React.Fragment key={index}>
                <p className="text-gray-400 font-mono">
                  [{transcript.timestamp}]
                </p>
                <p className="text-white">{transcript.text}</p>
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
            {topicTab.flashcards.map((flashcard, index) => (
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

  const selectedTab = lectureTabs[selectedTabIndex];

  function truncate(str: string) {
    const limit = 25;
    return str.length > limit ? str.slice(0, limit) + "…" : str;
  }

  return (
    <main>
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
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setTopicTab(section)}
                  className={`flex gap-2 px-4 py-2 rounded-lg duration-200 ${
                    topicTab.title === section.title
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
            <h1 className="text-white font-bold text-2xl">{topicTab.title}</h1>
            <button
              onClick={handleDownload}
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
    </main>
  );
}
