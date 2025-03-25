"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React, { useRef, useState, useEffect } from "react";

function FlashCard({ question, answer }: { question: string; answer: string }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  const flipCard = contextSafe(() => {
    if (cardRef.current) {
      setFlipped(!flipped);
    }
  });

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationX: flipped ? 180 : 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }
  }, [flipped]);

  return (
    <div
      className="w-full max-w-4xl h-[160px] perspective-1000 cursor-pointer"
      onClick={flipCard}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Question Side */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-[#20212A] rounded-lg"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <h4 className="text-lg font-bold text-white p-4">{question}</h4>
        </div>

        {/* Answer Side */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-[#20212A] rounded-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <p className="text-md text-white p-4">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FlashCard;
