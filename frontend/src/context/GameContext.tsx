import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";

export interface MemeTemplate {
  id: string;
  image_url: string;
}

export interface Player {
  socket_id: string;
  token: string;
  name: string;
  score: number;
  memeTemplate?: MemeTemplate[];
  extraImage?: MemeTemplate[];
  currentRoundImage?: MemeTemplate | null;
}

export interface VotingImage {
  submissionId: string;
  imageUrl: string;
  captionText: string;
}

export interface RoundInfo {
  roundNumber: number;
  phase: "submitting" | "voting" | "reveal";
  roundEndsAt?: number;
}

interface GameContextType {
  roomCode: string;
  playerToken: string;
  playerName: string;
  isHost: boolean;
  players: Player[];
  currentRound: RoundInfo | null;
  currentRoundImage: MemeTemplate | null;
  allMemeImages: MemeTemplate[];
  extraImages: MemeTemplate[];
  votingImages: VotingImage[];
  results: Player[];
  isGameOver: boolean;
  appError: string | null;
  hasSubmittedCaption: boolean;
  hasSubmittedVote: boolean;
  createRoom: (name: string) => void;
  joinRoom: (name: string, code: string) => void;
  startGame: () => void;
  submitCaption: (captionText: string) => void;
  submitVote: (votedForToken: string) => void;
  clearError: () => void;
  leaveRoom: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState<string>(
    () => sessionStorage.getItem("lolby_room_code") || ""
  );
  const [playerToken, setPlayerToken] = useState<string>(
    () => sessionStorage.getItem("lolby_player_token") || ""
  );
  const [playerName, setPlayerName] = useState<string>(
    () => sessionStorage.getItem("lolby_player_name") || ""
  );
  const [isHost, setIsHost] = useState<boolean>(
    () => sessionStorage.getItem("lolby_is_host") === "true"
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [currentRoundImage, setCurrentRoundImage] =
    useState<MemeTemplate | null>(null);
  const [allMemeImages, setAllMemeImages] = useState<MemeTemplate[]>([]);
  const [extraImages, setExtraImages] = useState<MemeTemplate[]>([]);
  const [votingImages, setVotingImages] = useState<VotingImage[]>([]);
  const [results, setResults] = useState<Player[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [hasSubmittedCaption, setHasSubmittedCaption] =
    useState<boolean>(false);
  const [hasSubmittedVote, setHasSubmittedVote] = useState<boolean>(false);

  // Sync session storage
  const updateSession = useCallback(
    (code: string, token: string, name: string, host: boolean) => {
      setRoomCode(code);
      setPlayerToken(token);
      setPlayerName(name);
      setIsHost(host);
      sessionStorage.setItem("lolby_room_code", code);
      sessionStorage.setItem("lolby_player_token", token);
      sessionStorage.setItem("lolby_player_name", name);
      sessionStorage.setItem("lolby_is_host", host ? "true" : "false");
    },
    []
  );

  const clearSession = useCallback(() => {
    setRoomCode("");
    setPlayerToken("");
    setPlayerName("");
    setIsHost(false);
    setPlayers([]);
    setCurrentRound(null);
    setCurrentRoundImage(null);
    setVotingImages([]);
    setResults([]);
    setIsGameOver(false);
    setHasSubmittedCaption(false);
    setHasSubmittedVote(false);
    sessionStorage.removeItem("lolby_room_code");
    sessionStorage.removeItem("lolby_player_token");
    sessionStorage.removeItem("lolby_player_name");
    sessionStorage.removeItem("lolby_is_host");
  }, []);

  const clearError = useCallback(() => {
    setAppError(null);
  }, []);

  // Action methods
  const createRoom = useCallback(
    (name: string) => {
      if (!name.trim()) {
        setAppError("Please enter your name to create a lobby");
        return;
      }
      setPlayerName(name);
      socket.emit("createRoom", { name: name.trim() });
    },
    []
  );

  const joinRoom = useCallback(
    (name: string, code: string) => {
      if (!name.trim() || !code.trim()) {
        setAppError("Please enter both your name and 6-character room code");
        return;
      }
      const upperCode = code.trim().toUpperCase();
      setPlayerName(name);
      setRoomCode(upperCode);
      socket.emit("joinRoom", { name: name.trim(), roomCode: upperCode });
    },
    []
  );

  const startGame = useCallback(() => {
    if (!roomCode || !playerToken) {
      setAppError("Missing room code or player token to start");
      return;
    }
    socket.emit("startGame", { roomCode, token: playerToken });
  }, [roomCode, playerToken]);

  const submitCaption = useCallback(
    (captionText: string) => {
      if (!currentRoundImage?.id) {
        setAppError("No meme template loaded for this round");
        return;
      }
      if (!captionText.trim()) {
        setAppError("Please enter a caption");
        return;
      }
      socket.emit("submitCaption", {
        roomCode,
        playerToken,
        imageId: currentRoundImage.id,
        captionText: captionText.trim(),
      });
    },
    [roomCode, playerToken, currentRoundImage]
  );

  const submitVote = useCallback(
    (votedForToken: string) => {
      if (!votedForToken) {
        setAppError("Please select a meme to vote for");
        return;
      }
      socket.emit("submitVote", {
        roomCode,
        voterToken: playerToken,
        votedForToken,
      });
    },
    [roomCode, playerToken]
  );

  const leaveRoom = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

  // Socket event subscriptions
  useEffect(() => {
    const handleRoomGenerated = (data: {
      code: string;
      host_id: string;
      players: Player[];
    }) => {
      updateSession(data.code, data.host_id, playerName, true);
      setPlayers(data.players || []);
      navigate(`/waiting-room/${data.code}`);
    };

    const handleJoinedRoom = (token: string) => {
      updateSession(roomCode, token, playerName, false);
      navigate(`/waiting-room/${roomCode}`);
    };

    const handlePlayerListUpdated = (data: { players: Player[] }) => {
      if (data?.players) {
        setPlayers(data.players);
      }
    };

    const handleRoundStarted = (round: RoundInfo) => {
      setCurrentRound(round);
      setHasSubmittedCaption(false);
      setHasSubmittedVote(false);
      // For round 1, transition immediately from waiting room.
      // For subsequent rounds, Result.tsx shows scores for 7s before transitioning.
      if (round.roundNumber === 1) {
        navigate("/caption-writing");
      }
    };


    const handleCurrentRoundImage = (image: MemeTemplate) => {
      setCurrentRoundImage(image);
    };

    const handleMemeImages = (images: MemeTemplate[]) => {
      setAllMemeImages(images || []);
    };

    const handleExtraImages = (images: MemeTemplate[]) => {
      setExtraImages(images || []);
    };

    const handleCaptionSubmitted = () => {
      setHasSubmittedCaption(true);
    };

    const handleVotingImages = (images: VotingImage[]) => {
      setVotingImages(images || []);
      navigate("/voting");
    };

    const handleVoteSubmitted = () => {
      setHasSubmittedVote(true);
    };

    const handleResult = (arrangedPlayers: Player[]) => {
      setResults(arrangedPlayers || []);
      navigate("/result");
    };

    const handleFinalScore = (arrangedPlayers: Player[]) => {
      setResults(arrangedPlayers || []);
      setIsGameOver(true);
      navigate("/result");
    };

    const handleAppError = (data: { message: string }) => {
      setAppError(data?.message || "An unexpected error occurred");
    };

    socket.on("roomGenerated", handleRoomGenerated);
    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("playerListUpdated", handlePlayerListUpdated);
    socket.on("roundStarted", handleRoundStarted);
    socket.on("currentRoundImage", handleCurrentRoundImage);
    socket.on("memeImages", handleMemeImages);
    socket.on("extraImages", handleExtraImages);
    socket.on("captionSubmitted", handleCaptionSubmitted);
    socket.on("votingImages", handleVotingImages);
    socket.on("voteSubmitted", handleVoteSubmitted);
    socket.on("result", handleResult);
    socket.on("finalScore", handleFinalScore);
    socket.on("appError", handleAppError);
    socket.on("error", handleAppError);

    return () => {
      socket.off("roomGenerated", handleRoomGenerated);
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("playerListUpdated", handlePlayerListUpdated);
      socket.off("roundStarted", handleRoundStarted);
      socket.off("currentRoundImage", handleCurrentRoundImage);
      socket.off("memeImages", handleMemeImages);
      socket.off("extraImages", handleExtraImages);
      socket.off("captionSubmitted", handleCaptionSubmitted);
      socket.off("votingImages", handleVotingImages);
      socket.off("voteSubmitted", handleVoteSubmitted);
      socket.off("result", handleResult);
      socket.off("finalScore", handleFinalScore);
      socket.off("appError", handleAppError);
      socket.off("error", handleAppError);
    };
  }, [navigate, playerName, roomCode, updateSession]);

  return (
    <GameContext.Provider
      value={{
        roomCode,
        playerToken,
        playerName,
        isHost,
        players,
        currentRound,
        currentRoundImage,
        allMemeImages,
        extraImages,
        votingImages,
        results,
        isGameOver,
        appError,
        hasSubmittedCaption,
        hasSubmittedVote,
        createRoom,
        joinRoom,
        startGame,
        submitCaption,
        submitVote,
        clearError,
        leaveRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
