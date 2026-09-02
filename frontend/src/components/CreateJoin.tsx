import React, { useState } from "react";

const CreateJoin = () => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const floated = focused || value.length > 0;
  return (
    <div className="w-screen items-center flex justify-center pt-20">
      <div className="relative p-5 overflow-hidden hover:rotate-2 transition-all duration-150 bg-[#040a18] w-150 h-70  rounded-[40px] border-2 border-[#39ff14]">
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
            className="relative w-full  mt-4 max-w-md h-10 border-[#6b7280] border-b-2 overflow-hidden"
            style={{
              backgroundColor: "#060e20",
            }}
          >
            {/* subtle vertical gradient for depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#222a3d",
              }}
            />

            {/* floating label */}
            <label
              className="absolute left-4 font-[font4] tracking-widest pointer-events-none transition-all duration-200 ease-out"
              style={{
                color: floated ? "#f7e017" : "#39e639",
                textShadow: floated && "0 0 4px rgba(247,224,23,0.6)",
                top: floated ? "6px" : "50%",
                transform: floated ? "translateY(0)" : "translateY(-50%)",
                fontSize: floated ? "0.65rem" : "1rem",
              }}
            >
              MEME NAME
            </label>

            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="relative h-full w-full bg-transparent px-4 pt-4 font-mono text-lg tracking-widest outline-none"
              style={{
                color: "#31d815",
                textShadow: "0 0 4px rgba(57,230,57,0.6)",
                caretColor: "#39e639",
              }}
            />
          </div>

          <button className="bg-[#eec200] uppercase h-13 shadow-[4px_6px_0px_#ffb0cd] border rounded-4xl font-[font2] text-[#4c3d00] mt-8 w-[95%]">
            Initialize Lobby
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-0
                                  bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        ></div>
      </div>
    </div>
  );
};

export default CreateJoin;
