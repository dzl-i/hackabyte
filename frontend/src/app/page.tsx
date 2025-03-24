import { Video } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Captions } from "lucide-react";
import StarGrid from "@/components/StarGrid";
import { Bakbak_One, Azeret_Mono } from "next/font/google";

const bakbak = Bakbak_One({ weight: "400", subsets: ["latin"] });
const azeretMono = Azeret_Mono({ weight: "400", subsets: ["latin"] });

export default function Home() {
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
          ></input>
        </label>
      </div>

      {/* Past submissions part */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-white">Past Submissions</p>

          <button className="flex text-white items-center hover:underline duration-200 gap-1 cursor-pointer">
            See More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 w-full">
          <div className="flex flex-col bg-[#262934] hover:bg-[#1c1e27] duration-200 w-full py-3 px-4 gap-y-1 rounded-md">
            <p className="text-md font-bold text-white">
              Rule & Utalitarianism
            </p>
            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
          <div className="flex flex-col bg-[#262934] hover:bg-[#1c1e27] duration-200 w-full py-3 px-4 gap-y-1 rounded-md">
            <h6 className="text-md font-bold text-white">
              Rule & Utalitarianism
            </h6>

            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
          <div className="flex flex-col bg-[#262934] hover:bg-[#1c1e27] duration-200 w-full py-3 px-4 gap-y-1 rounded-md">
            <h6 className="text-md font-bold text-white">
              Rule & Utalitarianism
            </h6>

            <p className="text-sm text-zinc-500">Uploaded an hour ago</p>
          </div>
        </div>
      </div>
    </main>
  );
}
