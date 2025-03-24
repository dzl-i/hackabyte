import { Captions, Video } from "lucide-react";
import { Bakbak_One } from "next/font/google";
import { useRouter } from "next/navigation";

const bakbak = Bakbak_One({ weight: "400", subsets: ["latin"] });

export default function NavBar() {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center py-4 px-6 border border-b border-white/15">
      <h1
        onClick={() => router.push("/")}
        className={`text-white font-bold text-2xl uppercase cursor-pointer ${bakbak.className}`}
      >
        SmartScribe
      </h1>
      <div className="flex gap-2">
        <label
          htmlFor="upload-video"
          className="flex justify-center items-center gap-2 px-4 py-2 relative cursor-pointer overflow-clip rounded-lg shadow-[0px_4px_80px_0px_rgba(149,204,255,0.05)] hover:shadow-[0px_4px_80px_0px_rgba(149,204,255,0.1)] border-1 border-[rgb(149,_204,_255,_0.15)] bg-[rgba(32,_33,_42,_1)] hover:bg-[rgba(32,_33,_42,_0.75)] duration-200"
        >
          <Video className="text-white h-8 w-8" />
          <p className="text-white">Upload video</p>
          <input
            id="upload-video"
            type="file"
            className="hidden"
            accept=".mp4"
          ></input>
        </label>
        <label
          htmlFor="upload-transcript"
          className="flex justify-center items-center gap-2 px-4 py-2 relative cursor-pointer overflow-clip rounded-lg shadow-[0px_4px_80px_0px_rgba(149,204,255,0.05)] hover:shadow-[0px_4px_80px_0px_rgba(149,204,255,0.1)] border-1 border-[rgb(149,_204,_255,_0.15)] bg-[rgba(32,_33,_42,_1)] hover:bg-[rgba(32,_33,_42,_0.75)] duration-200"
        >
          <Captions className="text-white h-8 w-8" />
          <p className="text-white">Upload transcript</p>
          <input
            id="upload-transcript"
            type="file"
            className="hidden"
            accept=".vtt"
          ></input>
        </label>
      </div>
    </nav>
  );
}
