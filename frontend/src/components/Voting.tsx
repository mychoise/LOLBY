import { Flame, Heart } from "lucide-react";

const Voting = () => {
  return (
    <div className="">
      <div className="flex flex-col mt-10 gap-6 w-full h-full items-center justify-center">
        <h1 className="font-[font8] text-6xl tracking-tighter [text-shadow:0_0_0px_#fcaecb,0_0_20px_#fcaecb,0_0_0px_#fcaecb] text-[#ffb4ab]">
          VOTE OR DIE
        </h1>

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

        <div
          className="mt-10 flex flex-row
            -7"
        >
          <div className="flex items-center hover:-translate-y-1 transition-aqll duration-300 hover:shadow-[7px_5px_0px_#ffb0cd] pt-5 gap-10 pb-5 justify-center flex-col w-90 h-auto border-3 border-[#574048] ">
            <div className="w-[90%] relative h-75 bg-yellow-400">
              <img
                src="https://imgflip.com/s/meme/Cute-Cat.jpg"
                className="w-full h-full object-fill"
              />
              <h1 className="text-black text-center absolute bottom-0 font-[font4] text-[23px] tracking-tighter  font-extrabold">
                When code works
              </h1>
            </div>

            <button className="w-[90%]  flex items-center justify-center  gap-4 border-3 border=[#ffb0cd] font-[font5] text-4xl font-extrabold text-[#ffb0cd] h-20">
              <Heart size={30} />
              <span>DANK</span>
            </button>
          </div>

          <div className="flex items-center hover:-translate-y-1 transition-all duration-300 hover:shadow-[7px_5px_0px_#fdc700] pt-5 gap-10 pb-5 justify-center flex-col w-90 h-auto border-5 border-[#ffe083] ">
            <div className="w-[90%] relative h-75 bg-yellow-400">
              <img
                src="https://imgflip.com/s/meme/Cute-Cat.jpg"
                className="w-full h-full object-fill"
              />
              <h1 className="text-black text-center absolute bottom-0 font-[font4] text-[23px] tracking-tighter  font-extrabold">
                When code works
              </h1>
            </div>

            <button className="w-[90%] bg-[#ffe083] flex items-center justify-center  gap-4 border-3 border=[#ffb0cd] font-[font5] text-4xl font-extrabold text-[#302600] h-20">
              <Flame color="#302600" size={30} />
              <span>DANKED</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0
                                      bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
      ></div>
    </div>
  );
};
export default Voting;
