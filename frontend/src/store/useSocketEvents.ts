import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket";
import {
  useGameStore,
  type Player,
  type RoundInfo,
  type MemeTemplate,
  type VotingImage,
} from "./useGameStore";

export const useSocketEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomGenerated = (data: {
      code: string;
      host_id: string;
      players: Player[];
    }) => {
      const state = useGameStore.getState();
      state.updateSession(data.code, data.host_id, state.playerName, true);
      state.setPlayers(data.players || []);
      navigate(`/waiting-room/${data.code}`);
    };

    const handleJoinedRoom = (token: string) => {
      const state = useGameStore.getState();
      state.updateSession(state.roomCode, token, state.playerName, false);
      navigate(`/waiting-room/${state.roomCode}`);
    };

    const handlePlayerListUpdated = (data: { players: Player[] }) => {
      if (data?.players) {
        useGameStore.getState().setPlayers(data.players);
      }
    };

    const handleRoundStarted = (round: RoundInfo) => {
      const state = useGameStore.getState();
      state.setCurrentRound(round);
      state.setHasSubmittedCaption(false);
      state.setHasSubmittedVote(false);
      // For round 1, transition immediately from waiting room.
      // For subsequent rounds, Result.tsx shows scores for 7s before transitioning.
      if (round.roundNumber === 1) {
        navigate("/caption-writing");
      }
    };

    const handleCurrentRoundImage = (image: MemeTemplate) => {
      useGameStore.getState().setCurrentRoundImage(image);
    };

    const handleMemeImages = (images: MemeTemplate[]) => {
      useGameStore.getState().setAllMemeImages(images || []);
    };

    const handleExtraImages = (images: MemeTemplate[]) => {
      useGameStore.getState().setExtraImages(images || []);
    };

    const handleCaptionSubmitted = () => {
      useGameStore.getState().setHasSubmittedCaption(true);
    };

    const handleVotingImages = (images: VotingImage[]) => {
      useGameStore.getState().setVotingImages(images || []);
      navigate("/voting");
    };

    const handleVoteSubmitted = () => {
      useGameStore.getState().setHasSubmittedVote(true);
    };

    const handleResult = (arrangedPlayers: Player[]) => {
      useGameStore.getState().setResults(arrangedPlayers || []);
      navigate("/result");
    };

    const handleFinalScore = (arrangedPlayers: Player[]) => {
      const state = useGameStore.getState();
      state.setResults(arrangedPlayers || []);
      state.setIsGameOver(true);
      navigate("/result");
    };

    const handleAppError = (data: { message: string }) => {
      useGameStore
        .getState()
        .setAppError(data?.message || "An unexpected error occurred");
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
  }, [navigate]);
};
