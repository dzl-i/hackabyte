import Image from "next/image";
import { Button } from "../components/ui/button";
import { Video } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Captions } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-[100vh]">
      <img src="logo.svg" className="w-100 mt-10"></img>

      {/* Uploading part */}
      <div className="flex flex-col gap-y-4 items-center mt-10">
        <p className="text-sm text-white">
          Please upload your content to get started
        </p>

        <div className="flex flex-row gap-x-2">
          <label
            htmlFor="upload-video"
            className="flex flex-col justify-center items-center w-60 h-40 bg-zinc-800 rounded-lg border border-zinc-600"
          >
            <Video className="text-white" size={40} />
            <p className="text-white">Upload a video</p>
            <input
              id="upload-video"
              type="file"
              className="hidden"
              accept="video/mp4"
            ></input>
          </label>

          <label
            htmlFor="upload-transcript"
            className="flex flex-col justify-center items-center w-60 h-40 bg-zinc-800 rounded-lg border border-zinc-600"
          >
            <Captions className="text-white" size={40} />
            <p className="text-white">Upload a transcript</p>
            <input
              id="upload-transcript"
              type="file"
              className="hidden"
              accept="text/vtt text/txt"
            ></input>
          </label>
        </div>
      </div>

      {/* Past submissions part */}
      <div className="mt-10 w-[60%]">
        <div className="flex">
          <h5 className="text-xl font-bold text-white mr-auto">
            Past Submissions
          </h5>

          <button className="flex text-white items-center gap-x-1 cursor-pointer">
            See More <ArrowRight size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-y-2 mt-4">
          <div className="flex flex-col bg-zinc-800 w-[100%] py-3 px-4 gap-y-1 rounded-md">
            <h6 className="text-md font-bold text-white">
              Rule & Utalitarianism
            </h6>

            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
          <div className="flex flex-col bg-zinc-800 w-[100%] py-3 px-4 gap-y-1 rounded-md">
            <h6 className="text-md font-bold text-white">
              Rule & Utalitarianism
            </h6>

            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
          <div className="flex flex-col bg-zinc-800 w-[100%] py-3 px-4 gap-y-1 rounded-md">
            <h6 className="text-md font-bold text-white">
              Rule & Utalitarianism
            </h6>

            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
