import { useState, useEffect } from "react";

import { useGame } from "../context/GameContext";
import { Hourglass, CheckCircle2 } from "lucide-react";

const CaptionWriting = () => {
  const {
    currentRoundImage,
    currentRound,
    submitCaption,
    hasSubmittedCaption,
  } = useGame();

  const [meme, setMeme] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!currentRound?.roundEndsAt) return 60;
      const endsAt =
        typeof currentRound.roundEndsAt === "number"
          ? currentRound.roundEndsAt
          : parseInt(currentRound.roundEndsAt, 10);
      const diff = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentRound?.roundEndsAt]);

  const handleSubmit = () => {
    if (!meme.trim() || hasSubmittedCaption) return;
    submitCaption(meme);
  };

  const timerPercent = Math.min(100, Math.max(0, (timeLeft / 60) * 100));
  const fallbackImage = "https://imgflip.com/s/meme/Cute-Cat.jpg";
  const imageUrl = currentRoundImage?.image_url || fallbackImage;

  return (
    <div className="w-full min-h-screen pb-16">
      <div className="flex flex-col gap-10 max-h-full items-center justify-center pt-12 px-4">
        {/* Timer Bar */}
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="uppercase rotate-1 text-[#aaaaaa] text-2xl font-[font6]">
              Time til ded
            </h1>
            <h1
              className={`font-[font6] text-3xl ${
                timeLeft <= 10 ? "text-[#ff3333] animate-pulse" : "text-[#facc15]"
              }`}
            >
              {timeLeft}s
            </h1>
          </div>
          <div className="w-full bg-[#111827] rotate-0.5 mt-2 h-6 border-2 border-[#39ff14] shadow-[7px_5px_0px_#39ff14] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-linear ${
                timeLeft <= 10 ? "bg-[#ff3333]" : "bg-[#39ff14]"
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center max-w-6xl w-full">
          {/* Meme Preview Card */}
          <div className="relative bg-[#060e20] -rotate-1 w-80 sm:w-110 lg:w-130 h-80 sm:h-110 lg:h-130 border-4 border-[#39ff14] shadow-[7px_6px_0px_#facc15] overflow-hidden flex items-center justify-center">
            <img
              className="w-full h-full object-contain bg-black"
              src={imageUrl}
              alt="Current round meme"
            />
            {/* Live Text Overlay */}
            <div className="absolute bottom-4 left-0 right-0 px-4 text-center pointer-events-none">
              <span className="inline-block bg-black/80 px-4 py-2 text-[#ff3131] rotate-0.5 text-2xl sm:text-3xl font-[font6] uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-red-500/40 max-w-[90%] break-words">
                {meme || "WHEN THE CODE COMPILES..."}
              </span>
            </div>
          </div>

          {/* Input & Action Panel */}
          <div className="flex-col flex gap-8 w-full max-w-md">
            <div className="flex gap-2 flex-col">
              <h1 className="font-[font6] rotate-0.5 text-[21px] text-[#39ff14]">
                YOUR PUNCHLINE:
              </h1>
              <input
                disabled={hasSubmittedCaption}
                value={meme}
                onChange={(e) => setMeme(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className={`font-[font7] uppercase focus:text-[#39ff14] focus:border-r-2 focus:border-b-2 outline-0 focus:border-[#39ff14] focus:border-2 transition-all rotate-1 shadow-[3px_3px_0px_#facc15] bg-[#1a1a1a] text-[18px] pr-4 pl-4 h-16 border-l-2 border-t-2 ${
                  hasSubmittedCaption
                    ? "opacity-50 cursor-not-allowed text-gray-500"
                    : "text-white"
                }`}
                placeholder="ENTER TEH TEXT..."
              />
            </div>

            <div className="flex gap-2 flex-col">
              <h1 className="font-[font6] -rotate-0.5 text-[21px] text-[#39ff14]">
                LIVE PREVIEW:
              </h1>
              <input
                disabled
                value={meme || "WHEN THE CODE COMPILES..."}
                className="font-[font7] uppercase text-[#39ff14] outline-0 -rotate-1 shadow-[4px_4px_0px_#39ff14] bg-[#1a1a1a] text-[18px] pr-4 pl-4 h-16 border-2 truncate"
              />
            </div>

            {!hasSubmittedCaption ? (
              <button
                onClick={handleSubmit}
                disabled={!meme.trim()}
                className={`border-[#000] border-3 uppercase tracking-wider h-18 shadow-[4px_6px_0px_#39ff14] text-3xl font-[font6] text-[#000000] mt-2 w-full transition-all ${
                  meme.trim()
                    ? "bg-[#ffcc00] hover:brightness-110 active:scale-95 cursor-pointer"
                    : "bg-gray-600 opacity-60 cursor-not-allowed"
                }`}
              >
                MAKE IT DANK
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center p-5 bg-[#0e172a] border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)] mt-2">
                <div className="flex items-center gap-2 text-emerald-400 font-[font6] text-xl">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>CAPTION LOCKED IN</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mt-2">
                  <Hourglass className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Waiting for other players to submit...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionWriting;
