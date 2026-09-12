import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { useGame } from "../context/GameContext";

export default function Voting() {
  const {
    votingImages,
    submitVote,
    hasSubmittedVote,
    currentRound,
  } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setSelectedSubmissionId] = useState<string>("");

  const activeSubmission =
    votingImages.length > 0
      ? votingImages[Math.min(currentIndex, votingImages.length - 1)]
      : null;

  const handleSelectAndVote = (submissionId: string) => {
    if (hasSubmittedVote || !submissionId) return;
    setSelectedSubmissionId(submissionId);
    submitVote(submissionId);
  };


  const handleNext = () => {
    if (currentIndex < votingImages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const roundNum = currentRound?.roundNumber
    ? String(currentRound.roundNumber).padStart(2, "0")
    : "01";

  if (!activeSubmission) {
    return (
      <div className="min-h-screen w-full bg-[#120b2e] flex flex-col items-center justify-center py-6 px-4 font-sans text-white">
        <div className="flex flex-col items-center gap-4 bg-[#0e0b26] p-8 rounded-2xl border border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.15)] max-w-md text-center">
          <Hourglass className="h-8 w-8 animate-spin text-amber-400" />
          <h2 className="text-xl font-bold font-mono text-cyan-300">
            AWAITING ARENA FEED...
          </h2>
          <p className="text-sm text-slate-400">
            Captions are being compiled by the mainframe. Voting will begin shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#120b2e] flex flex-col items-center py-6 px-4 font-sans text-white">
      {/* Card */}
      <div className="w-full max-w-2xl rounded-2xl border border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.15)] bg-[#0e0b26] overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-400/30">
          <div className="flex items-center gap-2 text-cyan-300 text-xs tracking-wide font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
            <span>&gt; ARENA_FEED.EXE // ROUND_{roundNum}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            {votingImages.length > 1 && (
              <span className="text-amber-400 font-bold">
                [{currentIndex + 1} / {votingImages.length}]
              </span>
            )}
            <div className="flex items-center gap-1 text-rose-400">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>VOTING: LIVE</span>
            </div>
          </div>
        </div>

        {/* Meme content */}
        <div className="p-5">
          {/* Top banner */}
          <div className="mb-3 border-2 border-amber-400 bg-black py-2 px-4 text-center">
            <p className="text-amber-300 font-[font6] uppercase text-sm tracking-wider">
              {hasSubmittedVote
                ? "YOUR VOTE IS RECORDED"
                : "INSPECT SUBMISSION & CAST YOUR VOTE"}
            </p>
          </div>

          {/* Image & Caption Display */}
          <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#3a3550] to-[#1c1830] flex items-center justify-center overflow-hidden rounded-lg border border-slate-700">
            <img
              src={activeSubmission.imageUrl}
              alt="Meme to vote on"
              className="w-full h-full object-contain bg-black"
            />
            {/* Bottom overlay caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/75 py-3 px-4 text-center border-t border-amber-400/40">
              <p className="text-white font-extrabold uppercase italic text-lg sm:text-xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] break-words">
                {activeSubmission.captionText}
              </p>
            </div>

            {/* Navigation arrows if multiple submissions */}
            {votingImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full border border-cyan-400/50 hover:bg-black/90 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6 text-cyan-300" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === votingImages.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full border border-cyan-400/50 hover:bg-black/90 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6 text-cyan-300" />
                </button>
              </>
            )}
          </div>

          {/* Controls row */}
          <div className="mt-5 flex flex-col gap-3">
            {!hasSubmittedVote ? (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <button
                  onClick={() => handleSelectAndVote(activeSubmission.submissionId)}
                  className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-lg tracking-wider border-2 transition-all bg-emerald-400 hover:bg-emerald-300 text-emerald-950 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] cursor-pointer active:scale-98"
                >
                  <Sparkles size={20} strokeWidth={2.5} />
                  VOTE THIS DANK (+121 PTS)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 bg-emerald-950/40 border border-emerald-500/60 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>VOTE RECORDED (+121 POINTS SENT)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mt-1.5">
                  <Hourglass className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span>Waiting for other hackers to finish voting...</span>
                </div>
              </div>
            )}

            {/* Thumbnail dots if multiple submissions */}
            {votingImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                {votingImages.map((sub, idx) => (
                  <button
                    key={sub.submissionId || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? "w-8 bg-cyan-400"
                        : "w-2.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
