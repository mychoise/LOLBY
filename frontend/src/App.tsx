import React from "react";

const App = () => {
  return (
    <div className="font-[font2] w-w-screen pt-20 pl-30 h-screen bg-[#000000]">
      <div className="relative overflow-hidden hover:rotate-6 transition-all duration-150 bg-[#040a18] w-90 h-100 flex items-center justify-center rounded-2xl border border-green-500">
        <div>
          <h1
            className="text-[#fcaecb] font-[font5] text-4xl font-bold
                         [text-shadow:0_0_10px_#fcaecb,0_0_0px_#fcaecb,0_0_40px_#fcaecb] uppercase"
          >
            Hack Room
          </h1>

          {/* scanlines — placed AFTER text so they render on top of it */}
        </div>
        <div
          className="pointer-events-none absolute inset-0
                              bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        ></div>
      </div>
    </div>
  );
};

export default App;
