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
    <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border-2 border-red-500 bg-[#16060c] px-5 py-3 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-red-300 font-mono text-sm">
      <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
      <span>{appError}</span>
      <button
        onClick={clearError}
        className="ml-2 rounded p-1 hover:bg-red-500/20 text-red-400"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="bg-[#000000] h-auto min-h-screen w-full text-white">
      <Navbar />
      <ErrorBanner />
      <div>
        <Routes>
          <Route path="/" element={<CreateJoin />} />
          <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
          <Route path="/caption-writing" element={<CaptionWriting />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
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

