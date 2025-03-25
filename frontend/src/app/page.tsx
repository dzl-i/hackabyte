"use client";
import React, { useState } from "react";
import { Video } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Captions } from "lucide-react";
import StarGrid from "@/components/StarGrid";
import { Bakbak_One, Azeret_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import LectureItem from "@/components/LectureItem";
import { toast } from "sonner";
import { request } from "../hooks/useRequest";

const bakbak = Bakbak_One({ weight: "400", subsets: ["latin"] });
const azeretMono = Azeret_Mono({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const lectures = [
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
    { title: "Rule Utalitarian", lastUpdated: "Uploaded 1 hour ago" },
  ];

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    const { data, error } = await request("POST", "/lecture/video", formData);

    if (error) {
      toast("Error uploading video");
    }

    toast("Video successfully uploaded!");
  };

  const uploadTranscript = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    const { data, error } = await request(
      "POST",
      "/lecture/transcript",
      formData
    );

    if (error) {
      toast("Error uploading transcript");
    }

    toast("Transcript successfully uploaded!");
  };

  const getSubmissions = async () => {
    try {
      const res = await fetch("/lectures", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const okTest = () => {
    toast("Video successfully uploaded!");
  };

  return (
    <main className="flex flex-col justify-evenly items-center min-h-screen overflow-hidden p-6 py-16 gap-16">
      <StarGrid />
      {/* Headline */}
      <div className="text-center">
        <h1
          className={`text-white font-bold text-6xl uppercase ${bakbak.className}`}
        >
          SmartScribe
        </h1>
        <p className={`text-white ${azeretMono.className}`}>
          Smarter Notes, Faster Learning
        </p>
      </div>

      {/* Uploading part */}
      <div className="flex flex-row justify-center flex-wrap gap-4">
        {/* Upload a video */}
        <label
          htmlFor="upload-video"
          className="flex flex-col justify-center items-center gap-2 relative cursor-pointer w-60 h-40 overflow-clip rounded-lg shadow-[0px_4px_80px_0px_rgba(149,204,255,0.05)] hover:shadow-[0px_4px_80px_0px_rgba(149,204,255,0.1)] border border-[rgb(149,_204,_255,_0.4)] bg-[rgba(32,_33,_42,_1)] hover:bg-[rgba(32,_33,_42,_0.75)] duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(149,_204,_255,_0.1)] to-[rgba(149,_204,_255,_0)]" />
          <Video className="text-white h-10 w-10" />
          <p className="text-white">Upload a video</p>
          <input
            id="upload-video"
            type="file"
            className="hidden"
            accept=".mp4"
            onChange={uploadVideo}
          ></input>
        </label>

        {/* Upload a transcript */}
        <label
          htmlFor="upload-transcript"
          className="flex flex-col justify-center items-center gap-2 relative cursor-pointer w-60 h-40 overflow-clip rounded-lg shadow-[0px_4px_80px_0px_rgba(149,204,255,0.05)] hover:shadow-[0px_4px_80px_0px_rgba(149,204,255,0.1)] border-1 border-[rgb(149,_204,_255,_0.4)] bg-[rgba(32,_33,_42,_1)] hover:bg-[rgba(32,_33,_42,_0.75)] duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(149,_204,_255,_0.1)] to-[rgba(149,_204,_255,_0)]" />
          <Captions className="text-white h-10 w-10" />
          <p className="text-white">Upload transcript</p>
          <input
            id="upload-transcript"
            type="file"
            className="hidden"
            accept=".vtt"
            onChange={uploadTranscript}
          ></input>
        </label>
      </div>

      {/* Past submissions part */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-white">Past Submissions</p>

          <button
            className="flex text-white items-center hover:underline duration-200 gap-1 cursor-pointer"
            onClick={() => router.push("/lectures")}
          >
            See More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 w-full">
          {lectures.map((lecture, index) => (
            <LectureItem key={index} lecture={lecture} />
          ))}
        </div>
      </div>
    </main>
  );
}
