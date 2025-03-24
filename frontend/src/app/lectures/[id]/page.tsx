import { Bakbak_One, Azeret_Mono } from "next/font/google";

const bakbak = Bakbak_One({ weight: "400", subsets: ["latin"] });

export default function Page() {
  return (
    <main>
      <nav className="flex justify-between items-center">
        <h1
          className={`text-white font-bold text-xl uppercase ${bakbak.className}`}
        >
          SmartScribe
        </h1>
      </nav>
    </main>
  );
}
