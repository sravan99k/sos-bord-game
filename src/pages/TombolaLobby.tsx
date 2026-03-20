import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Coins, Trophy } from "lucide-react";
import { toast } from "sonner";
import { generateGameCode } from "@/lib/utils";

export default function TombolaLobby() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; coins: number } | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [entryFee, setEntryFee] = useState(10);

  useEffect(() => {
    const stored = localStorage.getItem("tombolaUser");
    if (!stored) { navigate("/tombola"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const createRoom = () => {
    if (!user || user.coins < 50 + entryFee) {
      toast.error("Not enough coins! Need 50 (host) + entry fee");
      return;
    }
    const code = generateGameCode();
    const room = { code, host: user.name, entryFee, players: [user.name], prize: entryFee };
    localStorage.setItem(`tombola_${code}`, JSON.stringify(room));
    setUser({ ...user, coins: user.coins - 50 - entryFee });
    localStorage.setItem("tombolaUser", JSON.stringify({ ...user, coins: user.coins - 50 - entryFee }));
    toast.success(`Room created! Code: ${code}`);
    navigate(`/tombola/room/${code}`);
  };

  const joinRoom = () => {
    if (!joinCode.trim()) { toast.error("Enter a room code"); return; }
    const room = localStorage.getItem(`tombola_${joinCode.toUpperCase()}`);
    if (!room) { toast.error("Room not found"); return; }
    const parsed = JSON.parse(room);
    if (!user || user.coins < parsed.entryFee) { toast.error("Not enough coins"); return; }
    parsed.players.push(user.name);
    parsed.prize += parsed.entryFee;
    localStorage.setItem(`tombola_${joinCode.toUpperCase()}`, JSON.stringify(parsed));
    setUser({ ...user, coins: user.coins - parsed.entryFee });
    localStorage.setItem("tombolaUser", JSON.stringify({ ...user, coins: user.coins - parsed.entryFee }));
    navigate(`/tombola/room/${joinCode.toUpperCase()}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern p-4">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg bg-muted/50 hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="coin-badge"><Coins className="w-4 h-4" />{user.coins}</div>
        </header>

        <h1 className="font-display text-2xl font-bold mb-6">Tombola Lobby</h1>

        <div className="space-y-4">
          <div className="game-card p-5">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent" /> Create Room
            </h2>
            {showCreate ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Entry Fee (coins)</label>
                  <div className="flex gap-2 mt-2">
                    {[5, 10, 20, 50].map(fee => (
                      <button key={fee} onClick={() => setEntryFee(fee)}
                        className={`px-4 py-2 rounded-lg font-display ${entryFee === fee ? "bg-primary text-primary-foreground" : "bg-muted/50"}`}>
                        {fee}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Host fee: 50 coins + {entryFee} entry = {50 + entryFee} total</p>
                <button onClick={createRoom} className="w-full btn-neon bg-accent">Create Room</button>
              </div>
            ) : (
              <button onClick={() => setShowCreate(true)} className="w-full btn-neon bg-accent">Create New Room</button>
            )}
          </div>

          <div className="game-card p-5">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Join Room
            </h2>
            <div className="flex gap-2">
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter code" className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none font-display uppercase tracking-widest" maxLength={6} />
              <button onClick={joinRoom} className="btn-neon">Join</button>
            </div>
          </div>

          <div className="game-card p-5">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-neon-yellow" /> How to Play
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• AI calls random numbers (1-90)</li>
              <li>• Strike numbers on your ticket within 10 seconds</li>
              <li>• Complete lines or Full House to win!</li>
              <li>• Winner takes the prize pool</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
