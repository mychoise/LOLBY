import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Flag,
  Download,
  Star,
  MessageCircle,
  Volume2,
  Settings,
} from "lucide-react";

export default function MemeArenaUI() {
  const [reaction, setReaction] = useState(1); // index of selected reaction emoji
  const [vote, setVote] = useState("dank"); // 'dank' | 'meh' | 'cringe'

  return (
    <div className="min-h-screen w-full bg-[#120b2e] flex flex-col items-center py-6 px-4 font-sans">
      {/* Card */}
      <div className="w-full max-w-2xl rounded-2xl border border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.15)] bg-[#0e0b26] overflow-hidden">
        {/* Top status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-400/30">
          <div className="flex items-center gap-2 text-cyan-300 text-xs tracking-wide font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
            <span>&gt; ARENA_FEED.EXE // ROUND_03</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400 text-xs font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>TELEMETRY: LIVE</span>
          </div>
        </div>

        {/* Meme content */}
        <div className="p-5">
          {/* Top caption */}
          <div className="mb-3 border-2 border-amber-400 bg-black">
            <p className="text-center text-white font-extrabold uppercase italic text-lg py-3 px-4 tracking-tight">
              "Hear me out: Q3 strategy is simple…"
            </p>
          </div>

          {/* Image placeholder area */}
          <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#3a3550] to-[#1c1830] flex items-center justify-center overflow-hidden rounded-sm">
            <img src="https://imgs.search.brave.com/AEP7MO5nvSbl9n0MM1Uh1Is00j1eIaWwzw38NekCBD4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vMlMzV0Ev/TUFFSmxNMlMzV0Ev/MS90bC9jYW52YS1o/YW5kc29tZS1hZnJp/Y2FuLW1hbi1sYXVn/aGluZy1vdXQtbG91/ZC1hdC1mdW5ueS1t/ZW1lLW9yLWpva2Ut/aGUtZm91bmQtb24t/aW50ZXJuZXQsLXNt/aWxpbmctYnJvYWRs/eS4tTUFFSmxNMlMz/V0EuanBn" />
            {/* Bottom overlay caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-3 px-4">
              <p className="text-center text-amber-300 font-extrabold uppercase italic text-lg leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
                Me explaining to the board why we spent 90% of
                <br />
                the budget on tennis balls
              </p>
            </div>
          </div>

          {/* Controls row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Dank / Meh / Cringe */}
            <div className="flex flex-1 gap-2 min-w-[260px]">
              <button
                onClick={() => setVote("dank")}
                className={`flex-1 flex items-center justify-center gap-1 rounded-md py-3 font-bold text-sm tracking-wide border-2 transition
                  ${
                    vote === "dank"
                      ? "bg-emerald-400 text-emerald-950 border-emerald-300"
                      : "bg-emerald-500/80 text-emerald-950 border-emerald-400/60"
                  }
                `}
              >
                <ChevronUp size={16} strokeWidth={3} /> DANK
              </button>

              <button
                onClick={() => setVote("meh")}
                className={`flex-1 flex flex-col items-center justify-center rounded-md py-2 font-mono border-2 transition
                  ${
                    vote === "meh"
                      ? "bg-slate-500 text-slate-100 border-slate-300"
                      : "bg-slate-700/80 text-slate-200 border-slate-500/60"
                  }
                `}
              >
                <span className="text-sm">¯\_(ツ)_/¯</span>
                <span className="text-[10px] tracking-widest">MEH</span>
              </button>

              <button
                onClick={() => setVote("cringe")}
                className={`flex-1 flex items-center justify-center gap-1 rounded-md py-3 font-bold text-sm tracking-wide border-2 transition
                  ${
                    vote === "cringe"
                      ? "bg-rose-500 text-white border-rose-300"
                      : "bg-rose-600/80 text-white border-rose-400/60"
                  }
                `}
              >
                <ChevronDown size={16} strokeWidth={3} /> CRINGE
              </button>
            </div>
          </div>

          {/* Bottom actions row */}
        </div>
      </div>

      {/* Bottom chat bar */}
    </div>
  );
}
