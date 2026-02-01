import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Bot, Grid3X3, Play } from "lucide-react";

const PLAYER_COLORS = [
  { name: "Ink Red", value: "hsl(0 75% 55%)", class: "bg-player-1" },
  { name: "Ink Blue", value: "hsl(210 80% 40%)", class: "bg-player-2" },
  { name: "Ink Green", value: "hsl(142 60% 35%)", class: "bg-player-3" },
  { name: "Ink Black", value: "hsl(220 20% 12%)", class: "bg-foreground" },
  { name: "Graphite", value: "hsl(0 0% 40%)", class: "bg-secondary" },
];

const GRID_SIZES = [3, 4, 5, 6, 7, 8, 9, 10];

interface Player {
  name: string;
  color: string;
  colorClass: string;
  isAI: boolean;
}

export default function SOSSetup() {
  const navigate = useNavigate();
  const [gridSize, setGridSize] = useState(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [players, setPlayers] = useState<Player[]>([
    { name: "You", color: "hsl(210 80% 30%)", colorClass: PLAYER_COLORS[1]!.class, isAI: false },
    { name: "Robot", color: "hsl(0 75% 55%)", colorClass: PLAYER_COLORS[0]!.class, isAI: true },
  ]);

  const updatePlayer = (index: number, updates: Partial<Player>) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index]!, ...updates };
    setPlayers(newPlayers);
  };

  const startGame = () => {
    navigate('/sos/game', {
      state: { players, gridSize, difficulty }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] relative font-body p-4 md:p-8 flex flex-col">
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col min-h-0">
        <header className="mb-6 flex items-center justify-between border-b-4 border-foreground pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted border-4 border-transparent hover:border-foreground transition-all"><ArrowLeft className="w-7 h-7" /></button>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-primary uppercase italic tracking-tight leading-none">Game Setup</h1>
              <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px] mt-1">Configure your battlefield</p>
            </div>
          </div>
          <button onClick={startGame} className="hidden md:flex items-center gap-2 px-8 py-3 bg-primary text-white font-display font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[6px_6px_0px_#000] border-4 border-primary uppercase">Start <Play className="w-5 h-5 fill-current" /></button>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide py-2">
          {/* Main Config Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Battlefield Size */}
            <section className="p-6 border-4 border-foreground bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)] h-full">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-muted pb-3">
                <Grid3X3 className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-black uppercase text-foreground">Grid: {gridSize}x{gridSize}</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {GRID_SIZES.map((size) => (
                  <button key={size} onClick={() => setGridSize(size)} className={`aspect-square border-4 font-black text-lg transition-all ${gridSize === size ? "border-primary bg-primary text-white shadow-[4px_4px_0px_rgba(0,0,0,0.2)]" : "border-foreground bg-white hover:border-primary text-foreground"}`}>{size}</button>
                ))}
              </div>
            </section>

            {/* AI Difficulty */}
            <section className="p-6 border-4 border-foreground bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)] h-full">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-muted pb-4">
                <Bot className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-black uppercase text-foreground">AI Intelligence</h2>
              </div>
              <div className="flex border-4 border-foreground overflow-hidden">
                {(['Easy', 'Medium', 'Hard'] as const).map((mode) => (
                  <button key={mode} onClick={() => setDifficulty(mode)} className={`flex-1 py-3 font-black transition-all border-r-4 last:border-r-0 border-foreground uppercase text-sm ${difficulty === mode ? "bg-primary text-white" : "bg-white hover:bg-primary/5"}`}>{mode}</button>
                ))}
              </div>
              <p className="mt-4 text-[10px] font-bold text-foreground/40 italic">* Hard mode uses defensive prediction logic.</p>
            </section>
          </div>

          {/* Player Configuration */}
          <section className="p-6 border-4 border-foreground bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-8 border-b-4 border-foreground/10 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-display font-black uppercase text-foreground">The Competitors</h2>
              </div>
              <div className="flex gap-2">
                {[2, 3, 4].map(num => (
                  <button key={num} onClick={() => {
                    const newPlayers = [...players];
                    if (num > players.length) {
                      for (let i = players.length; i < num; i++) {
                        newPlayers.push({ name: i === 1 ? "Robot" : `Player ${i + 1}`, color: PLAYER_COLORS[i % PLAYER_COLORS.length]!.value, colorClass: PLAYER_COLORS[i % PLAYER_COLORS.length]!.class, isAI: i === 1 });
                      }
                    } else {
                      newPlayers.splice(num);
                    }
                    setPlayers(newPlayers);
                  }} className={`w-8 h-8 rounded-full border-2 font-black text-xs transition-all ${players.length === num ? "bg-primary text-white border-primary" : "border-foreground hover:bg-muted"}`}>{num}</button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {players.map((player, index) => (
                <div key={index} className="p-4 border-4 border-muted/50 bg-muted/5 relative">
                  <div className="absolute -top-3 left-4 px-2 bg-foreground text-white font-black text-[9px] uppercase tracking-widest">P{index + 1}</div>
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-foreground/50">Display Name</label>
                      <input type="text" value={player.name} onChange={(e) => updatePlayer(index, { name: e.target.value })} className="w-full px-3 py-2 border-2 border-foreground bg-white text-lg font-black outline-none focus:border-primary transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-foreground/50">Controller</label>
                        <button onClick={() => updatePlayer(index, { isAI: !player.isAI })} className={`flex items-center justify-center gap-2 py-2 border-2 font-black text-xs transition-all ${player.isAI ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_#000]' : 'bg-white text-foreground border-foreground hover:bg-muted'}`}>
                          {player.isAI ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          {player.isAI ? "ROBOT" : "HUMAN"}
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-foreground/50">Ink Color</label>
                        <div className="flex flex-wrap gap-1">
                          {PLAYER_COLORS.map((color) => (
                            <button key={color.value} onClick={() => updatePlayer(index, { color: color.value, colorClass: color.class })} className={`w-6 h-6 border-2 transition-all ${player.color === color.value ? 'border-primary scale-110 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: color.value }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button onClick={startGame} className="md:hidden w-full py-6 border-4 border-primary bg-white text-primary font-display font-black text-2xl hover:bg-primary hover:text-white transition-all shadow-[12px_12px_0px_rgba(0,0,0,0.1)] active:translate-y-2 uppercase tracking-tighter">Start the battle</button>
        </div>
      </div>
    </div>
  );
}
