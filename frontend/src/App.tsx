import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateJoin from "./components/CreateJoin";
import CaptionWriting from "./components/CaptionWriting";
import Result from "./components/Result";
import Voting from "./components/Voting";
import WaitingRoom from "./components/WaitingRoom";
import Error from "./components/Error";

const App = () => {
  return (
    <div className="bg-[#000000] h-auto min-h-screen w-full text-white">
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<CreateJoin />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/caption-writing" element={<CaptionWriting />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
