import { useState } from "react";

const CaptionWriting = () => {
  const [meme, setMeme] = useState("");
  return (
    <div>
      <div className="flex flex-col gap-15 max-h-full items-center justify-center pt-20 ">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="uppercase rotate-2 text-[#aaaaaa] text-2xl font-[font6] ">
              Time til ded
            </h1>
            <h1 className="text-[#ff3333] font-[font6] text-3xl">0s</h1>
          </div>
          <div className="w-160 bg-[#000000] rotate-1 mt-2 shadow-[7px_5px_0px_#39ff14]">
            <div className="bg-[#ff3333] w-160 h-6"></div>
          </div>
        </div>
        <div className="flex flex-row gap-10">
          <div className="bg-red-100 -rotate-1 w-130 h-130 border-5 border-[#39ff14] shadow-[7px_6px_0px_#facc15]">
            <img
              className="w-full relative  grayscale-100 h-full object-fit"
              src="https://imgflip.com/s/meme/Cute-Cat.jpg"
            />
            <div className="absolute text-[#ff3131] rotate-1 text-4xl uppercase w-full  top-100 text-center font-[font6]">
              <h1>When the code works</h1>
            </div>
          </div>
          <div className="flex-col flex gap-13">
            <div className="flex gap-3 flex-col ">
              <h1 className="font-[font6] rotate-0.5 text-[21px] text-[#39ff14]">
                TOP TXT:
              </h1>
              <input
                value={meme}
                onChange={(e) => {
                  console.log(e.target.value);
                  setMeme(e.target.value);
                }}
                className="font-[font7] uppercase focus:text-[#39ff14] focus:border-r-2 focus:border-b-2 outline-0 focus:border-[#39ff14] focus:border-2 transition-all focus:shadow-[0px_0px_0px_#facc15] rotate-1 shadow-[3px_3px_0px_#facc15] bg-[#1a1a1a] text-gray-500 text-[20px]  pr-10 pl-3 w-140 h-16  border-l-2 border-t-2 "
                placeholder="ENTER TEH TEXT..."
              ></input>
            </div>
            <div className="flex gap-3 flex-col ">
              <h1 className="font-[font6] -rotate-0.5 text-[21px] text-[#39ff14]">
                TOP TXT:
              </h1>
              <input
                disabled
                value={"When the code works"}
                className="font-[font7] uppercase text-[#39ff14] focus:border-r-2 focus:border-b-2 outline-0 focus:border-[#39ff14] focus:border-2 transition-all  -rotate-1 shadow-[4px_4px_0px_#39ff14] bg-[#1a1a1a] text-[20px]  pr-10 pl-3 w-140 h-16 border-2 "
              ></input>
            </div>

            <button className="bg-[#ffcc00] border-[#000] border-3 uppercase tracking-wider h-20 shadow-[4px_6px_0px_#39ff14]  text-4xl  font-[font6] text-[#000000] mt-8 w-full">
              MAKE IT DANK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionWriting;
