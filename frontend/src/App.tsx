import React from "react";
import Navbar from "./components/Navbar";
import CreateJoin from "./components/CreateJoin";
import CaptionWriting from "./components/CaptionWriting";
import Result from "./components/Result";

const App = () => {
  return (
    <div className="bg-[#000000] h-screen">
      <Navbar />
      {/*<div>
        <CreateJoin />
      </div>*/}
      <div>
        {/*<CaptionWriting />*/}
        <Result />
      </div>
    </div>
  );
};

export default App;
