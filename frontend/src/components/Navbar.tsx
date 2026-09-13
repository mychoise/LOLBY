import { SquareTerminal, Ghost } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full select-none">
      <div className="bg-[#0b1326] px-4 sm:px-8 py-3 flex items-center justify-between min-h-[3.75rem] shadow-[0_4px_0px_#facc15]">
        <Link to="/" className="flex items-center group">
          <h1
            className="text-[#fcaecb] font-[font5] tracking-wide text-xl sm:text-2xl md:text-[28px] font-bold
                       [text-shadow:0_0_2px_#fcaecb,0_0_15px_#fcaecb] uppercase transition-transform group-hover:scale-[1.02]"
          >
            Lolby.exe
          </h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            title="Terminal Status"
            className="bg-[#222a3d] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl text-[#ffb0cd] shadow-sm transition-transform hover:scale-105"
          >
            <SquareTerminal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div
            title="Stealth Mode Active"
            className="bg-[#222a3d] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl text-[#ffb0cd] shadow-sm transition-transform hover:scale-105"
          >
            <Ghost className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
      <div className="bg-[#facc15] h-1 sm:h-1.5 w-full"></div>
    </header>
  );
};

export default Navbar;
