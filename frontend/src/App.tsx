import { useEffect, useState } from "react";
import { socket } from "./socket";

const App = () => {
  const [connected, setconnected] = useState(false);
  const [value, setvalue] = useState("");
  const [players, setPlayers] = useState([]);

  interface playerInterface {
    name: string;
    token: string;
    socketId: string;
  }
  useEffect(() => {
    socket.on("connect", () => {
      console.log("conneted", socket.id);
      const savedToken = localStorage.getItem("token");
      const savedCode = localStorage.getItem("code");
      if (savedToken && savedCode) {
        console.log("attempting rejoin with saved session");
        socket.emit("rejoinRoom", {
          code: savedCode,
          token: savedToken,
        });
        console.log("saved room is", savedCode);
        console.log("saved token is", savedToken);
      }
      setconnected(true);
    });

    socket.on("roomCreated", ({ roomId, token }) => {
      console.log("room id is", roomId);
      console.log("token is", token);
      localStorage.setItem("code", roomId);
      localStorage.setItem("token", token);
    });

    socket.on("joinedRoom", ({ token }) => {
      console.log("you have joined yo room");
      console.log("your token is", token);
      localStorage.setItem("token", token);
    });

    socket.on("playerListUpdated", ({ players }) => {
      console.log("players now:", players);
      setPlayers(players);
    });

    socket.on("error", ({ message }) => {
      console.log("oops error:::", message);
    });
  });
  return (
    <div>
      <h1>Testing site !!!!</h1>
      <h1>
        <p>{connected ? "Connected" : "Connecting..."}</p>
      </h1>{" "}
      <h1></h1>
      <button
        onClick={() => {
          socket.emit("createRoom");
        }}
      >
        Create room
      </button>
      <br />
      <input
        value={value}
        onChange={(e) => setvalue(e.target.value)}
        placeholder="enter room code"
      ></input>
      <button
        onClick={() => {
          console.log("valueis", value);
          socket.emit("joinRoom", { code: value });
          localStorage.setItem("code", value);
        }}
      >
        join room
      </button>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {players?.map((player: playerInterface) => (
            <tr key={player?.token}>
              <td>{player?.name ?? player?.token}</td>
              <td>{player?.socketId ? "Connected" : "Disconnected"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
