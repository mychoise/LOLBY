import { SquareTerminal, Ghost } from "lucide-react";

const Navbar = () => {
  return (
    <div>
      <div className="bg-[#0b1326] p-5 pt-2 flex flex-row h-15 shadow-[1px_5px_0px_#facc15]">
        <div>
          <h1
            className="text-[#fcaecb] font-[font5] [word-spacing:0.1rem]  text-[30px] font-bold
                           [text-shadow:0_0_2px_#fcaecb,0_0_0px_#fcaecb,0_0_20px_#fcaecb] uppercase"
          >
            Lolby.exe
          </h1>
        </div>
        <div className="flex flex-row gap-2 ml-auto mt-2 h-auto items-center">
          <div className="bg-[#222a3d] w-10 h-12 flex items-center justify-center rounded-2xl text-[#ffb0cd]">
            <SquareTerminal />
          </div>
          <div className="bg-[#222a3d] w-10 h-12 flex items-center justify-center rounded-2xl text-[#ffb0cd]">
            <Ghost />
          </div>
        </div>
      </div>
      <div className="bg-[#facc15] ml-1.5 h-2 w-auto "></div>
    </div>
  );
};

export default Navbar;
