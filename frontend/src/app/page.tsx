"use client";
import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Captions } from "lucide-react";
import StarGrid from "@/components/StarGrid";
import { Bakbak_One, Azeret_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import LectureItem, { Lecture } from "@/components/LectureItem";
import { toast } from "sonner";
import { request } from "../hooks/useRequest";

const bakbak = Bakbak_One({ weight: "400", subsets: ["latin"] });
const azeretMono = Azeret_Mono({ weight: "400", subsets: ["latin"] });

const STORAGE_KEY = "submissions";

export default function Home() {
  const router = useRouter();

  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [submissions, setSubmissions] = useState<Lecture[]>([]);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const loadSubmissions = () => {
      const storedSubmissions = localStorage.getItem(STORAGE_KEY);
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }
    };

    loadSubmissions();
  }, []);

  const addSubmissionToStorage = (newSubmission: Lecture) => {
    const storedSubmissions = localStorage.getItem(STORAGE_KEY);
    let updatedSubmissions: Set<Lecture> = new Set();

    // Get current submission
    if (storedSubmissions) {
      updatedSubmissions = new Set(JSON.parse(storedSubmissions) as Lecture[]);
    }

    // Add new submission
    updatedSubmissions = updatedSubmissions.add(newSubmission);

    const newSubmissions: Lecture[] = Array.from(updatedSubmissions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubmissions));

    // Update state
    setSubmissions(newSubmissions);
  };

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoadingVideo(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    const { data, error } = await request("POST", "/lecture/video", formData);

    if (error) {
      toast("Error uploading video");
    } else {
      addSubmissionToStorage({
        id: data.id,
        title: data.title,
        createdAt: data.createdAt,
      });
      toast("Video successfully uploaded!");
    }

    setIsLoadingVideo(false);
  };

  const uploadTranscript = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoadingTranscript(true);

    const formData = new FormData();
    formData.append("file", files[0]);

    const { data, error } = await request(
      "POST",
      "/lecture/transcript",
      formData
    );

    if (error) {
      toast("Error uploading transcript");
    } else {
      addSubmissionToStorage({
        id: data.id,
        title: data.title,
        createdAt: data.createdAt,
      });
      toast("Transcript successfully uploaded!");
    }

    setIsLoadingTranscript(false);
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

          {isLoadingVideo && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#95CCFF]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
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

          {isLoadingTranscript && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#95CCFF]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </label>
      </div>

      {/* Past submissions part */}
      {submissions.length && (
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
            {submissions.slice(0, 3).map((lecture, index) => (
              <LectureItem key={index} lecture={lecture} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
