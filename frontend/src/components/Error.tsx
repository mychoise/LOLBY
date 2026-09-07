import { AlertTriangle, Rocket, X, Circle } from "lucide-react";

export default function Error() {
  return (
    <div className="flex w-full items-center justify-center bg-black px-4 py-10 font-mono text-white">
      <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/60 bg-[#0a0e14] shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        {/* Title bar tab */}
        <div className="absolute -top-4 left-6 flex items-center gap-2 rounded-md border border-emerald-500/60 bg-[#0a0e14] px-3 py-1 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="tracking-wide">&gt; 404_EXCEPTION.SH</span>
        </div>

        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Status pill */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs tracking-widest text-slate-300">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            PROTOCOL_HALTED // DISCONNECTED
          </span>

          {/* Headline */}
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              404 // MEME NOT
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              FOUND
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-emerald-400">
            &gt; FATAL ERROR: MEME_BUFFER_EMPTY // ROOM DROPPED THE PUNCHLINE
            INTO THE VOID.
          </p>

          {/* Terminal window */}
          <div className="mt-6 w-full rounded-xl border border-dashed border-slate-700 bg-black/60 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex flex-col items-center gap-4 py-6">
              <p className="text-3xl text-slate-200">¯\_(ツ)_/¯</p>
              <span className="rounded border border-red-500/60 bg-red-500/10 px-3 py-1 text-xs tracking-widest text-red-400">
                [ NULL_POINTER_EXCEPTION ]
              </span>
            </div>
          </div>

          {/* Target room */}
          <p className="mt-6 text-sm text-fuchsia-400">
            &gt; TARGET_ROOM: <span className="font-bold">#DANK-69420</span>{" "}
            <span className="ml-1 rounded border border-red-500/60 bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
              [OFFLINE]
            </span>
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-pink-900/30 transition-transform hover:scale-[1.03]">
              REBOOT TO LOBBY
              <Rocket className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-transparent px-6 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-emerald-500/10">
              HOST DROPPED
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 flex w-full items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
              CORE_MAINFRAME: READY
            </span>
            <span>LOLBY.NET // 0x404</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0
                                               bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
      ></div>
    </div>
  );
}
