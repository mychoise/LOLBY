export interface Room {
  code: string;
  players: Player[];
  host_id: string;
  gamestatus: 'lobby' | 'in-progress' | 'completed';
}

export interface Player {
  socket_id: string;
  token: string;
  name: string;
}
