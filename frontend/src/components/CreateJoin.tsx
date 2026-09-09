import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";

const CreateJoin = () => {
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
    socket.emit("createRoom", { name: createName });
  }

  return (
    <div className="w-screen items-center flex gap-20 justify-center pt-20">
      <div className="relative p-5 hover:rotate-2 transition-all duration-150 bg-[#040a18] w-150 h-auto  rounded-[40px] border-2 border-[#39ff14]">
        <div>
          <h1
            className="text-[#fcaecb] font-[font5] [word-spacing:0.1rem]  text-[40px] font-bold
                             [text-shadow:0_0_0px_#fcaecb,0_0_0px_#fcaecb,0_0_40px_#fcaecb] uppercase"
          >
            Hack Room
          </h1>
          <p className="font-[font4] text-[15px] text-[#debec8]">
            Initialize a new secure lobby. Enter your alias to proceed.
          </p>

          <div
            className="relative w-[95%]  mt-4  h-10 border-[#6b7280] border-b-2 overflow-hidden"
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
                textShadow: createNameFloated && "0 0 4px rgba(247,224,23,0.6)",
                top: createNameFloated ? "6px" : "50%",
                transform: createNameFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: createNameFloated ? "0.65rem" : "1rem",
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
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <button
            onClick={handleCreateRoom}
            className="bg-[#eec200] uppercase h-13 shadow-[4px_6px_0px_#ffb0cd] border rounded-4xl font-[font2] text-[#4c3d00] mt-8 w-[95%]"
          >
            Initialize Lobby
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-0
                                  bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        ></div>

        <div className="absolute -top-5 p-1 -rotate-3  -left-5 bg-[#000000] border-2 border-[#39ff14]">
          <h1 className="text-[#39ff14] items-center gap-1 flex text-[15px] font-[font4] ">
            <ChevronRight size={17} /> <span>EXECUTE_CREATE.sh</span>
          </h1>
        </div>
      </div>

      <div className="relative p-5 pl-7 pb-7 hover:-rotate-2 transition-all duration-150 bg-[#040a18] w-130 h-auto  rounded-[40px] border-2 border-[#39ff14]">
        <div>
          <h1
            className="text-[#eec200] font-[font5] [word-spacing:0.1rem]  text-[40px] font-bold
                                 [text-shadow:0_0_0px_#fcaecb,0_0_0px_#fcaecb,0_0_40px_#fcaecb] uppercase"
          >
            INFILTRATE
          </h1>
          <p className="font-[font4] text-[15px] text-[#debec8]">
            Join an existing lobby. Credentials required.
          </p>

          <div
            className="relative w-[95%]  mt-4  h-10 border-[#6b7280] border-b-2 overflow-hidden"
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
                textShadow: joinNameFloated && "0 0 4px rgba(247,224,23,0.6)",
                top: joinNameFloated ? "6px" : "50%",
                transform: joinNameFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: joinNameFloated ? "0.65rem" : "1rem",
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
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <div
            className="relative w-[95%]  mt-4  h-10 border-[#6b7280] border-b-2 overflow-hidden"
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
                textShadow: joinCodeFloated && "0 0 4px rgba(247,224,23,0.6)",
                top: joinCodeFloated ? "6px" : "50%",
                transform: joinCodeFloated
                  ? "translateY(0)"
                  : "translateY(-50%)",
                fontSize: joinCodeFloated ? "0.65rem" : "1rem",
              }}
            >
              6-DIGIT CODE
            </label>

            <input
              type="number"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onFocus={() => setJoinCodeFocused(true)}
              onBlur={() => setJoinCodeFocused(false)}
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <button className="bg-[#f751a1] uppercase h-13 shadow-[4px_6px_0px_#eec200] border rounded-4xl font-[font2] text-[#4c3d00] mt-8 w-[95%]">
            Breach Mainframe
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-0
                                      bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        ></div>

        <div className="absolute -top-5 p-1 rotate-3  -right-5 bg-[#000000] border-2 border-[#39ff14]">
          <h1 className="text-[#39ff14] items-center gap-1 flex text-[15px] font-[font4] ">
            <ChevronRight size={17} /> <span>BREACH_PROTOCOL.exe</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CreateJoin;
