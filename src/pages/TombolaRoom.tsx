import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Copy, Play, Coins } from "lucide-react";
import { toast } from "sonner";

export default function TombolaRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<{ code: string; host: string; entryFee: number; players: string[]; prize: number } | null>(null);
  const [user, setUser] = useState<{ name: string; coins: number } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("tombolaUser");
    if (!storedUser) { navigate("/tombola"); return; }
    setUser(JSON.parse(storedUser));
    
    const storedRoom = localStorage.getItem(`tombola_${roomCode}`);
    if (!storedRoom) { toast.error("Room not found"); navigate("/tombola/lobby"); return; }
    setRoom(JSON.parse(storedRoom));
  }, [roomCode, navigate]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode || "");
    toast.success("Code copied!");
  };

  const startGame = () => {
    if (!room || !user) return;
    if (room.host !== user.name) { toast.error("Only host can start"); return; }
    if (room.players.length < 2) { toast.error("Need at least 2 players"); return; }
    navigate(`/tombola/game/${roomCode}`);
  };

  if (!room || !user) return null;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern p-4">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/tombola/lobby")} className="p-2 rounded-lg bg-muted/50 hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="coin-badge"><Coins className="w-4 h-4" />{user.coins}</div>
        </header>

        <div className="game-card p-6 mb-4 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-xl font-bold">Room Code</h1>
            <button onClick={copyCode} className="p-2 rounded-lg bg-muted/50 hover:bg-muted"><Copy className="w-4 h-4" /></button>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30 border border-border">
            <span className="font-display text-4xl font-black tracking-[0.3em] text-primary">{roomCode}</span>
          </div>
        </div>

        <div className="game-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Players ({room.players.length}/10)
            </h2>
            <div className="coin-badge text-sm">Prize: {room.prize}</div>
          </div>
          <div className="space-y-2">
            {room.players.map((player, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-bold text-sm">
                  {player[0]?.toUpperCase()}
                </div>
                <span className="font-medium">{player}</span>
                {player === room.host && <span className="text-xs px-2 py-0.5 rounded-full bg-neon-yellow/20 text-neon-yellow">Host</span>}
              </div>
            ))}
          </div>
        </div>

        {room.host === user.name && (
          <button onClick={startGame} className="w-full btn-neon flex items-center justify-center gap-2 py-4">
            <Play className="w-5 h-5" /> Start Game
          </button>
        )}
        {room.host !== user.name && (
          <div className="text-center text-muted-foreground p-4 game-card">Waiting for host to start...</div>
        )}
      </div>
    </div>
  );
}
