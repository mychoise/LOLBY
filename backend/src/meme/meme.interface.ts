export interface Room {
  code: string;
  players: Player[];
  host_id: string;
  gamestatus: 'lobby' | 'in-progress' | 'completed';
  currentRound?: Round | null;
  roundNumber?: number;
}

export interface Player {
  socket_id: string;
  token: string;
  name: string;
  score: number; // you'll need this for voting/scoring later
  memeTemplate?: MemeTemplate[]; // their 7 round-images, assigned once at game start
  extraImage?: MemeTemplate[]; // their 3 bonus images
}

export interface MemeTemplate {
  id: string;
  image_url: string;
}

export interface Submission {
  playerToken: string;
  templateId: string;
  captionText: string;
}

export interface Vote {
  voterToken: string;
  votedForToken: string;
}

export interface Round {
  roundNumber: number;
  submissions: Submission[];
  votes: Vote[];
  phase: 'submitting' | 'voting' | 'reveal';
  roundEndsAt: number | null;
}
