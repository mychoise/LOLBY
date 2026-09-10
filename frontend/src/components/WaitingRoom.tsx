import React, { useEffect } from "react";
import {
  Users,
  Crown,
  Copy,
  Plus,
  Hourglass,
  LogOut,
  Rocket,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const players = [
  {
    slot: "Host",
    isHost: true,
    status: "Ready",
    name: "MEMELORD_X...",
    meta: "Lvl. 42 • Ping 18ms",
    avatarBg: "from-pink-500 to-rose-600",
    avatarIcon: "👑",
  },
  {
    slot: "Slot #2",
    isHost: false,
    status: "Ready",
    name: "DankVader",
    meta: "Lvl. 27 • Ping 24ms",
    avatarBg: "from-sky-400 to-indigo-500",
    avatarIcon: "🐧",
  },
  {
    slot: "Slot #3",
    isHost: false,
    status: "Ready",
    name: "CringeConnois...",
    meta: "Lvl. 35 • Ping 32ms",
    avatarBg: "from-amber-400 to-orange-600",
    avatarIcon: "🔥",
  },
  {
    slot: "Slot #4",
    isHost: false,
    status: "Connecting...",
    name: "NoobSlayer420",
    meta: "Syncing assets...",
    avatarBg: "from-violet-500 to-fuchsia-600",
    avatarIcon: "⚡",
  },
];

function StatusPill({ status }) {
  const isReady = status === "Ready";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isReady
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-amber-500/15 text-amber-400"
      }`}
    >
      {isReady && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
      {status}
    </span>
  );
}

function PlayerCard({ player }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        player.isHost
          ? "border-fuchsia-500/50 bg-fuchsia-500/[0.04]"
          : "border-slate-700/60 bg-slate-800/30"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        {player.isHost ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/90 px-2 py-0.5 text-xs font-bold text-slate-900">
            <Crown className="h-3 w-3" />
            Host
          </span>
        ) : (
          <span className="text-xs font-mono text-slate-400">
            {player.slot}
          </span>
        )}
        <StatusPill status={player.status} />
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${player.avatarBg} text-lg shadow-lg`}
        >
          {player.avatarIcon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{player.name}</p>
          <p className="truncate text-xs text-slate-400">{player.meta}</p>
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ isInvite }) {
  if (isInvite) {
    return (
      <button className="flex h-full min-h-[92px] w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-700 text-slate-400 transition-colors hover:border-fuchsia-500/50 hover:text-fuchsia-400">
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">+ Invite Player</span>
      </button>
    );
  }
  return (
    <div className="flex h-full min-h-[92px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-800 text-slate-600">
      <Hourglass className="h-4 w-4" />
      <span className="text-xs font-mono">Waiting for player...</span>
    </div>
  );
}

export default function WaitingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) {
      navigate("/");
    }
  }, [roomId, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#0b0e1a] px-4 py-10 font-sans text-white">
      <div>
        <h1 className="text-green-500">{roomId}</h1>
      </div>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Waiting for players to ready up
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Waiting Room
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Match starts automatically once the host launches.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-3">
            <span className="font-mono text-sm text-slate-400">
              ROOM CODE:{" "}
              <span className="font-bold text-amber-400">{roomId}</span>
            </span>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">
              <Copy className="h-3.5 w-3.5" />
              Copy Code
            </button>
            <span className="h-4 w-px bg-slate-700" />
            <span className="font-mono text-xs text-slate-400">
              <span className="font-bold text-fuchsia-400">4</span> / 8 Players
              Joined
            </span>
          </div>
        </div>

        {/* Players panel */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-fuchsia-400" />
              <h2 className="text-sm font-bold">Players in Room</h2>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              3 Ready • 1 Connecting
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {players.map((p) => (
              <PlayerCard key={p.name} player={p} />
            ))}
            <EmptySlot isInvite />
            <EmptySlot />
            <EmptySlot />
            <EmptySlot />
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-900/60 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm font-bold">Ready to start match</p>
              <p className="text-xs text-slate-400">
                Minimum 2 players required. You have host authority.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700">
              <LogOut className="h-3.5 w-3.5" />
              Leave Room
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-pink-900/30 transition-transform hover:scale-[1.02]">
              Start Match
              <Rocket className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-xs text-slate-600">
          Lobby.exe v2.4.0 • Secured Arena Server
        </p>
      </div>
    </div>
  );
}
