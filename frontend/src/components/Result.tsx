import { ChevronRight } from "lucide-react";

const Result = () => {
  return (
    <div className="w-screen ">
      <div className="mt-4 w-screen justify-center items-center flex flex-col">
        <div className="flex gap-2 text-4xl items-center tracking-wider">
          <ChevronRight size={30} className="text-[#eebb04] text-3xl" />
          <h1 className="font-[font8] mb-2 uppercase text-[#eebb04] ">
            Round result...
          </h1>
        </div>
        <div className="flex gap-2 border-t-4 pt-4 border-[#fdaac0] flex-col">
          {/*//displaying the result*/}

          <div
            className="relative w-300 rounded-4xl  flex items-center gap-3  border-3 border-[#e3ba0a] bg-slate-900 px-7 py-3"
            style={{
              boxShadow:
                "0 0 8px rgba(251,191,36,0.7), 0 0 20px rgba(251,191,36,0.4), inset 0 0 12px rgba(251,191,36,0.08)",
            }}
          >
            <div className="flex-shrink-0 min-w-[44px] font-[font8] text-3xl text-amber-400">
              #1
            </div>

            <div className="flex flex-1 min-w-0 flex-col">
              <div className="truncate text-[19px] font-[font8] uppercase tracking-wide text-slate-100">
                Hack_uer
              </div>
              <div className="text-[14px] uppercase font-[font7] tracking-widest text-amber-400">
                User-1
              </div>
            </div>

            <div className="ml-auto flex-shrink-0 font-[font8] text-2xl text-pink-400">
              121
            </div>
          </div>

          {/*//next*/}

          <div className="relative w-300 rounded-4xl  flex items-center gap-3  border-3 border-[#2a1f28] bg-slate-900 px-7 py-2">
            <div className="flex-shrink-0 min-w-[44px] font-[font8] text-[18px] text-[#dabfc4]">
              #1
            </div>

            <div className="flex flex-1 min-w-0 flex-col">
              <div className="truncate text-[15px] font-[font8] uppercase tracking-wide text-slate-100">
                Hack_uer
              </div>
              <div className="text-[13px] uppercase font-[font7] tracking-widest text-amber-400">
                User-1
              </div>
            </div>

            <div className="ml-auto flex-shrink-0 font-[font8] text-2xl text-pink-400">
              121
            </div>
          </div>

          <div className="relative w-300 rounded-4xl  flex items-center gap-3  border-3 border-[#2a1f28] bg-slate-900 px-7 py-2">
            <div className="flex-shrink-0 min-w-[44px] font-[font8] text-[18px] text-[#dabfc4]">
              #1
            </div>

            <div className="flex flex-1 min-w-0 flex-col">
              <div className="truncate text-[15px] font-[font8] uppercase tracking-wide text-slate-100">
                Hack_uer
              </div>
              <div className="text-[13px] uppercase font-[font7] tracking-widest text-amber-400">
                User-1
              </div>
            </div>

            <div className="ml-auto flex-shrink-0 font-[font8] text-2xl text-pink-400">
              121
            </div>
          </div>
          <div className="relative w-300 rounded-4xl  flex items-center gap-3  border-3 border-[#2a1f28] bg-slate-900 px-7 py-2">
            <div className="flex-shrink-0 min-w-[44px] font-[font8] text-[18px] text-[#dabfc4]">
              #1
            </div>

            <div className="flex flex-1 min-w-0 flex-col">
              <div className="truncate text-[15px] font-[font8] uppercase tracking-wide text-slate-100">
                Hack_uer
              </div>
              <div className="text-[13px] uppercase font-[font7] tracking-widest text-amber-400">
                User-1
              </div>
            </div>

            <div className="ml-auto flex-shrink-0 font-[font8] text-2xl text-pink-400">
              121
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="relative rounded-4xl -rotate-2 px-12 py-4 font-bold tracking-wide text-[#5f0140] transition-transform active:scale-95 border-[#eb4ea3] text-3xl border-2 font-[font5]"
            style={{
              background:
                "linear-gradient(135deg, #f4aacf 0%, #e8b5e2 35%, #deaff2 70%, #deaff2 100%)",
            }}
          >
            NEXT HACK
          </button>

          <button className="relative rounded-4xl  px-12 py-4 font-bold tracking-wide text-[#fab5a8] transition-transform active:scale-95 border-[#fab5a8] bg-[#111a25] text-3xl border-3 font-[font5]">
            ABORT
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-0
                                        bg-[repeating-linear-gradient(0deg,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_0px,rgba(7,15,33,0.6)_1px,transparent_0px,transparent_3.4px)]"
        ></div>

        {/*button*/}
      </div>
    </div>
  );
};

export default Result;
