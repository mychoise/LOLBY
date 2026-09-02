import React from "react";
import Navbar from "./components/Navbar";
import CreateJoin from "./components/CreateJoin";

const App = () => {
  return (
    <div className="bg-[#000000] h-screen w-screen">
      <Navbar />
      <div>
        <CreateJoin />
      </div>
    </div>
  );
};

export default App;
