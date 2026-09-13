import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useGame } from "../context/GameContext";

const CreateJoin = () => {
  const { createRoom, joinRoom } = useGame();

  // Create lobby
  const [createName, setCreateName] = useState("");
  const [createNameFocused, setCreateNameFocused] = useState(false);
  const createNameFloated = createNameFocused || createName.length > 0;

  // Join lobby
  const [joinName, setJoinName] = useState("");
  const [joinNameFocused, setJoinNameFocused] = useState(false);
  const joinNameFloated = joinNameFocused || joinName.length > 0;

  const [joinCode, setJoinCode] = useState("");
  const [joinCodeFocused, setJoinCodeFocused] = useState(false);
  const joinCodeFloated = joinCodeFocused || joinCode.length > 0;

  function handleCreateRoom() {
    createRoom(createName);
  }

  function handleJoinRoom() {
    joinRoom(joinName, joinCode);
  }

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-12 xl:gap-16 px-4 py-8 sm:py-12 md:py-16 max-w-6xl mx-auto">
      {/* Create Lobby Card */}
      <div className="relative p-6 sm:p-8 sm:hover:rotate-1 transition-all duration-150 bg-[#040a18] w-full max-w-[460px] rounded-[32px] sm:rounded-[40px] border-2 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.15)]">
        <div>
          <h1
            className="text-[#fcaecb] font-[font5] tracking-wide text-2xl sm:text-3xl md:text-[38px] font-bold
                       [text-shadow:0_0_2px_#fcaecb,0_0_20px_#fcaecb] uppercase"
          >
            Hack Room
          </h1>
          <p className="font-[font4] text-sm sm:text-[15px] text-[#debec8] mt-1">
            Initialize a new secure lobby. Enter your alias to proceed.
          </p>

          <div
            className="relative w-full mt-6 h-12 border-[#6b7280] border-b-2 overflow-hidden rounded-t"
            style={{
              backgroundColor: "#060e20",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#222a3d",
              }}
            />

            <label
              className="absolute left-4 font-[font4] tracking-widest pointer-events-none transition-all duration-200 ease-out"
              style={{
                color: createNameFloated ? "#f7e017" : "#39e639",
                textShadow: createNameFloated
                  ? "0 0 4px rgba(247,224,23,0.6)"
                  : undefined,
                top: createNameFloated ? "6px" : "50%",
                transform: createNameFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: createNameFloated ? "0.65rem" : "0.95rem",
              }}
            >
              MEME NAME
            </label>

            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onFocus={() => setCreateNameFocused(true)}
              onBlur={() => setCreateNameFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateRoom();
              }}
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-base sm:text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <button
            onClick={handleCreateRoom}
            className="bg-[#eec200] cursor-pointer hover:brightness-110 active:scale-95 transition-all uppercase h-12 sm:h-13 shadow-[4px_5px_0px_#ffb0cd] border rounded-full font-[font2] text-sm sm:text-base text-[#4c3d00] font-bold mt-8 w-full"
          >
            Initialize Lobby
          </button>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden
                     bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        />

        <div className="absolute -top-4 sm:-top-5 p-1 -rotate-2 left-4 sm:-left-3 bg-[#000000] border-2 border-[#39ff14] shadow-md">
          <h2 className="text-[#39ff14] items-center gap-1 flex text-xs sm:text-[14px] font-[font4]">
            <ChevronRight size={15} /> <span>EXECUTE_CREATE.sh</span>
          </h2>
        </div>
      </div>

      {/* Join Lobby Card */}
      <div className="relative p-6 sm:p-8 sm:hover:-rotate-1 transition-all duration-150 bg-[#040a18] w-full max-w-[460px] rounded-[32px] sm:rounded-[40px] border-2 border-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.15)]">
        <div>
          <h1
            className="text-[#eec200] font-[font5] tracking-wide text-2xl sm:text-3xl md:text-[38px] font-bold
                       [text-shadow:0_0_2px_#fcaecb,0_0_20px_#fcaecb] uppercase"
          >
            INFILTRATE
          </h1>
          <p className="font-[font4] text-sm sm:text-[15px] text-[#debec8] mt-1">
            Join an existing lobby. Credentials required.
          </p>

          <div
            className="relative w-full mt-6 h-12 border-[#6b7280] border-b-2 overflow-hidden rounded-t"
            style={{
              backgroundColor: "#060e20",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#222a3d",
              }}
            />
            <label
              className="absolute left-4 font-[font4] tracking-widest pointer-events-none transition-all duration-200 ease-out"
              style={{
                color: joinNameFloated ? "#f7e017" : "#39e639",
                textShadow: joinNameFloated
                  ? "0 0 4px rgba(247,224,23,0.6)"
                  : undefined,
                top: joinNameFloated ? "6px" : "50%",
                transform: joinNameFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: joinNameFloated ? "0.65rem" : "0.95rem",
              }}
            >
              MEME NAME
            </label>

            <input
              type="text"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              onFocus={() => setJoinNameFocused(true)}
              onBlur={() => setJoinNameFocused(false)}
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-base sm:text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <div
            className="relative w-full mt-4 h-12 border-[#6b7280] border-b-2 overflow-hidden rounded-t"
            style={{
              backgroundColor: "#060e20",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#222a3d",
              }}
            />
            <label
              className="absolute left-4 font-[font4] tracking-widest pointer-events-none transition-all duration-200 ease-out"
              style={{
                color: joinCodeFloated ? "#f7e017" : "#39e639",
                textShadow: joinCodeFloated
                  ? "0 0 4px rgba(247,224,23,0.6)"
                  : undefined,
                top: joinCodeFloated ? "6px" : "50%",
                transform: joinCodeFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: joinCodeFloated ? "0.65rem" : "0.95rem",
              }}
            >
              6-DIGIT CODE
            </label>

            <input
              type="text"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onFocus={() => setJoinCodeFocused(true)}
              onBlur={() => setJoinCodeFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoinRoom();
              }}
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-base sm:text-lg tracking-widest outline-none uppercase"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            className="bg-[#f751a1] cursor-pointer hover:brightness-110 active:scale-95 transition-all uppercase h-12 sm:h-13 shadow-[4px_5px_0px_#eec200] border rounded-full font-[font2] text-sm sm:text-base text-[#4c3d00] font-bold mt-8 w-full"
          >
            Breach Mainframe
          </button>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] sm:rounded-[40px] overflow-hidden
                     bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        />

        <div className="absolute -top-4 sm:-top-5 p-1 rotate-2 right-4 sm:-right-3 bg-[#000000] border-2 border-[#39ff14] shadow-md">
          <h2 className="text-[#39ff14] items-center gap-1 flex text-xs sm:text-[14px] font-[font4]">
            <ChevronRight size={15} /> <span>BREACH_PROTOCOL.exe</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CreateJoin;
