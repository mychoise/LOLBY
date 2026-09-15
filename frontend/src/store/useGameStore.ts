import { create } from "zustand";
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

const getStoredValue = (key: string): string => {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || "";
};

const getStoredToken = (): string => {
  return (
    localStorage.getItem("lolby_player_token") ||
    localStorage.getItem("user_token") ||
    sessionStorage.getItem("lolby_player_token") ||
    ""
  );
};

export interface GameState {
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

  // Actions
  setRoomCode: (code: string) => void;
  setPlayerToken: (token: string) => void;
  setPlayerName: (name: string) => void;
  setIsHost: (isHost: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentRound: (round: RoundInfo | null) => void;
  setCurrentRoundImage: (image: MemeTemplate | null) => void;
  setAllMemeImages: (images: MemeTemplate[]) => void;
  setExtraImages: (images: MemeTemplate[]) => void;
  setVotingImages: (images: VotingImage[]) => void;
  setResults: (results: Player[]) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setAppError: (error: string | null) => void;
  setHasSubmittedCaption: (submitted: boolean) => void;
  setHasSubmittedVote: (submitted: boolean) => void;

  updateSession: (
    code: string,
    token: string,
    name: string,
    host: boolean,
  ) => void;
  clearSession: () => void;
  clearError: () => void;

  // Socket action methods
  createRoom: (name: string) => void;
  joinRoom: (name: string, code: string) => void;
  startGame: () => void;
  submitCaption: (captionText: string) => void;
  submitVote: (votedForToken: string) => void;
  extraImageGet: () => void;
  leaveRoom: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  roomCode: getStoredValue("lolby_room_code"),
  playerToken: getStoredToken(),
  playerName: getStoredValue("lolby_player_name"),
  isHost: getStoredValue("lolby_is_host") === "true",
  players: [],
  currentRound: null,
  currentRoundImage: null,
  allMemeImages: [],
  extraImages: [],
  votingImages: [],
  results: [],
  isGameOver: false,
  appError: null,
  hasSubmittedCaption: false,
  hasSubmittedVote: false,

  setRoomCode: (roomCode) => set({ roomCode }),
  setPlayerToken: (playerToken) => set({ playerToken }),
  setPlayerName: (playerName) => set({ playerName }),
  setIsHost: (isHost) => set({ isHost }),
  setPlayers: (players) => set({ players }),
  setCurrentRound: (currentRound) => set({ currentRound }),
  setCurrentRoundImage: (currentRoundImage) => set({ currentRoundImage }),
  setAllMemeImages: (allMemeImages) => set({ allMemeImages }),
  setExtraImages: (extraImages) => set({ extraImages }),
  setVotingImages: (votingImages) => set({ votingImages }),
  setResults: (results) => set({ results }),
  setIsGameOver: (isGameOver) => set({ isGameOver }),
  setAppError: (appError) => set({ appError }),
  setHasSubmittedCaption: (hasSubmittedCaption) => set({ hasSubmittedCaption }),
  setHasSubmittedVote: (hasSubmittedVote) => set({ hasSubmittedVote }),

  updateSession: (code, token, name, host) => {
    set({
      roomCode: code,
      playerToken: token,
      playerName: name,
      isHost: host,
    });

    localStorage.setItem("lolby_player_token", token);
    localStorage.setItem("user_token", token);
    localStorage.setItem("lolby_room_code", code);
    localStorage.setItem("lolby_player_name", name);
    localStorage.setItem("lolby_is_host", host ? "true" : "false");

    sessionStorage.setItem("lolby_player_token", token);
    sessionStorage.setItem("lolby_room_code", code);
    sessionStorage.setItem("lolby_player_name", name);
    sessionStorage.setItem("lolby_is_host", host ? "true" : "false");
  },

  clearSession: () => {
    set({
      roomCode: "",
      playerToken: "",
      playerName: "",
      isHost: false,
      players: [],
      currentRound: null,
      currentRoundImage: null,
      votingImages: [],
      results: [],
      isGameOver: false,
      hasSubmittedCaption: false,
      hasSubmittedVote: false,
    });

    localStorage.removeItem("lolby_player_token");
    localStorage.removeItem("user_token");
    localStorage.removeItem("lolby_room_code");
    localStorage.removeItem("lolby_player_name");
    localStorage.removeItem("lolby_is_host");

    sessionStorage.removeItem("lolby_room_code");
    sessionStorage.removeItem("lolby_player_token");
    sessionStorage.removeItem("lolby_player_name");
    sessionStorage.removeItem("lolby_is_host");
  },

  clearError: () => set({ appError: null }),

  createRoom: (name: string) => {
    if (!name.trim()) {
      set({ appError: "Please enter your name to create a lobby" });
      return;
    }
    set({ playerName: name });
    socket.emit("createRoom", { name: name.trim() });
  },

  joinRoom: (name: string, code: string) => {
    if (!name.trim() || !code.trim()) {
      set({
        appError: "Please enter both your name and 6-character room code",
      });
      return;
    }
    const upperCode = code.trim().toUpperCase();
    const existingToken = get().playerToken || getStoredToken();
    set({ playerName: name, roomCode: upperCode });
    socket.emit("joinRoom", {
      name: name.trim(),
      roomCode: upperCode,
      ...(existingToken ? { token: existingToken } : {}),
    });
  },

  startGame: () => {
    const { roomCode, playerToken } = get();
    const activeToken = playerToken || getStoredToken();
    if (!roomCode || !activeToken) {
      set({ appError: "Missing room code or player token to start" });
      return;
    }
    socket.emit("startGame", { roomCode, token: activeToken });
  },

  submitCaption: (captionText: string) => {
    const { roomCode, playerToken, currentRoundImage } = get();
    const activeToken = playerToken || getStoredToken();
    if (!currentRoundImage?.id) {
      set({ appError: "No meme template loaded for this round" });
      return;
    }
    if (!captionText.trim()) {
      set({ appError: "Please enter a caption" });
      return;
    }
    if (!activeToken) {
      set({ appError: "Player token missing. Please re-join the room." });
      return;
    }
    socket.emit("submitCaption", {
      roomCode,
      playerToken: activeToken,
      imageId: currentRoundImage.id,
      captionText: captionText.trim(),
    });
  },

  extraImageGet: () => {
    const { extraImages } = get();
    if (extraImages.length === 0) {
      set({ appError: "No extra images available" });
      return;
    }
    set((state) => {
      const randomIndex = Math.floor(Math.random() * state.extraImages.length);
      const selectedImage = state.extraImages[randomIndex];
      return { currentRoundImage: selectedImage };
    });
  },

  submitVote: (votedForToken: string) => {
    const { roomCode, playerToken } = get();
    const activeToken = playerToken || getStoredToken();
    if (!votedForToken) {
      set({ appError: "Please select a meme to vote for" });
      return;
    }
    if (!activeToken) {
      set({ appError: "Voter token missing. Please re-join the room." });
      return;
    }
    socket.emit("submitVote", {
      roomCode,
      voterToken: activeToken,
      votedForToken,
    });
  },

  leaveRoom: () => {
    get().clearSession();
  },
}));

// Compatibility hook alias for existing useGame calls
export const useGame = useGameStore;
