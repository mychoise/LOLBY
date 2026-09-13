import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateJoin from "./components/CreateJoin";
import CaptionWriting from "./components/CaptionWriting";
import Result from "./components/Result";
import Voting from "./components/Voting";
import WaitingRoom from "./components/WaitingRoom";
import Error from "./components/Error";
import { GameProvider, useGame } from "./context/GameContext";
import { AlertCircle, X } from "lucide-react";

const ErrorBanner = () => {
  const { appError, clearError } = useGame();
  if (!appError) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-xl border-2 border-red-500 bg-[#16060c] px-4 sm:px-5 py-2.5 sm:py-3 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-red-300 font-mono text-xs sm:text-sm backdrop-blur-md">
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 shrink-0" />
        <span className="truncate">{appError}</span>
      </div>
      <button
        onClick={clearError}
        aria-label="Dismiss error"
        className="ml-2 rounded p-1 hover:bg-red-500/20 text-red-400 shrink-0 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="bg-[#000000] min-h-screen w-full overflow-x-hidden text-white flex flex-col">
      <Navbar />
      <ErrorBanner />
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<CreateJoin />} />
          <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
          <Route path="/caption-writing" element={<CaptionWriting />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;

