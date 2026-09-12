import { useEffect, useState } from "react";

import { ChevronRight, Trophy, ArrowRight, LogOut, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const Result = () => {
  const navigate = useNavigate();
  const { results, isGameOver, currentRound, leaveRoom } = useGame();
  const [countdown, setCountdown] = useState(7);

  // If game is not over and we have a next round ready, count down and transition
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/caption-writing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, navigate]);

  const handleNextHack = () => {
    if (isGameOver) {
      leaveRoom();
    } else {
      navigate("/caption-writing");
    }
  };

  const currentRoundNum = currentRound?.roundNumber || 1;

  return (
    <div className="w-screen min-h-screen pb-16 flex flex-col items-center">
      <div className="mt-6 w-full max-w-4xl justify-center items-center flex flex-col px-4">
        {/* Header */}
        <div className="flex gap-2 text-3xl sm:text-4xl items-center tracking-wider mb-2">
          {isGameOver ? (
            <Trophy size={36} className="text-[#facc15] animate-bounce" />
          ) : (
            <ChevronRight size={34} className="text-[#eebb04]" />
          )}
          <h1 className="font-[font8] uppercase text-[#eebb04]">
            {isGameOver ? "FINAL CHAMPION REVEALED" : `ROUND ${currentRoundNum - 1 > 0 ? currentRoundNum - 1 : currentRoundNum} RESULTS`}
          </h1>
        </div>

        {/* Auto Next Round countdown banner */}
        {!isGameOver && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-mono text-amber-300">
            <span>NEXT HACK INITIALIZING IN</span>
            <span className="font-bold text-amber-400 text-sm">{countdown}s</span>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="flex gap-3 border-t-4 pt-4 border-[#fdaac0] flex-col w-full">
          {results && results.length > 0 ? (
            results.map((player, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={player.token || player.socket_id || idx}
                  className={`relative w-full rounded-2xl sm:rounded-4xl flex items-center gap-4 px-6 sm:px-8 py-3.5 transition-all ${
                    isFirst
                      ? "border-3 border-[#e3ba0a] bg-[#101b33]"
                      : "border-2 border-[#2a1f28] bg-slate-900/80"
                  }`}
                  style={
                    isFirst
                      ? {
                          boxShadow:
                            "0 0 10px rgba(251,191,36,0.6), 0 0 25px rgba(251,191,36,0.3), inset 0 0 12px rgba(251,191,36,0.08)",
                        }
                      : undefined
                  }
                >
                  <div
                    className={`flex-shrink-0 min-w-[44px] font-[font8] ${
                      isFirst ? "text-3xl text-amber-400" : "text-xl text-[#dabfc4]"
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div className="flex flex-1 min-w-0 flex-col">
                    <div
                      className={`truncate font-[font8] uppercase tracking-wide ${
                        isFirst
                          ? "text-xl text-slate-100"
                          : "text-base text-slate-200"
                      }`}
                    >
                      {player.name}
                    </div>
                    <div className="text-[12px] uppercase font-[font7] tracking-widest text-amber-400/80">
                      {isFirst ? "CROWNED MEMELORD" : `CONTENDER`}
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-1.5 font-[font8] text-2xl sm:text-3xl text-pink-400">
                    <span>{player.score}</span>
                    <span className="text-xs font-mono text-pink-300/70">PTS</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono">
              [ NO ROUND TELEMETRY COMPILED YET ]
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
          <button
            onClick={handleNextHack}
            className="relative cursor-pointer hover:brightness-110 active:scale-95 rounded-4xl -rotate-1 px-8 sm:px-12 py-3 sm:py-4 font-bold tracking-wide text-[#5f0140] transition-all border-[#eb4ea3] text-2xl sm:text-3xl border-2 font-[font5] flex items-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, #f4aacf 0%, #e8b5e2 35%, #deaff2 70%, #deaff2 100%)",
            }}
          >
            {isGameOver ? (
              <>
                <span>PLAY AGAIN</span>
                <RotateCcw size={24} />
              </>
            ) : (
              <>
                <span>NEXT HACK NOW</span>
                <ArrowRight size={24} />
              </>
            )}
          </button>

          <button
            onClick={leaveRoom}
            className="relative cursor-pointer hover:bg-slate-800/80 active:scale-95 rounded-4xl px-8 sm:px-12 py-3 sm:py-4 font-bold tracking-wide text-[#fab5a8] transition-all border-[#fab5a8] bg-[#111a25] text-2xl sm:text-3xl border-3 font-[font5] flex items-center gap-2"
          >
            <span>ABORT</span>
            <LogOut size={22} />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]" />
      </div>
    </div>
  );
};

export default Result;
