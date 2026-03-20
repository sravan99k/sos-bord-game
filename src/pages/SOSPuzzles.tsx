import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Star, Trophy, Grid3X3, Lightbulb } from "lucide-react";
import { DAILY_PUZZLES } from "../data/puzzles";

export default function SOSPuzzles() {
    const navigate = useNavigate();

    const playPuzzle = (puzzle: typeof DAILY_PUZZLES[0]) => {
        navigate('/sos/game', {
            state: {
                players: [{ name: "You", color: "hsl(210 80% 30%)", isAI: false }], // Single player for puzzles
                gridSize: puzzle.gridSize,
                puzzleMode: true,
                puzzleTarget: puzzle.targetScore,
                initialGrid: puzzle.initialGrid,
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] relative font-body p-6">
            {/* Paper texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

            <div className="relative z-10 max-w-2xl mx-auto pb-20">
                <header className="flex items-center gap-6 mb-12 border-b-4 border-foreground pb-8">
                    <button onClick={() => navigate('/')} className="p-3 hover:bg-muted border-4 border-transparent hover:border-foreground transition-all">
                        <ArrowLeft className="w-8 h-8" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-display font-black text-primary uppercase italic tracking-tight">Puzzle Library</h1>
                        <p className="text-foreground font-bold uppercase tracking-widest text-xs">Sharpen your mind</p>
                    </div>
                </header>

                <div className="space-y-6">
                    {DAILY_PUZZLES.map((puzzle, index) => (
                        <div
                            key={puzzle.id}
                            className="group p-6 border-4 border-foreground bg-white hover:bg-muted/10 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)] flex items-center justify-between"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-4 bg-accent/10 border-4 border-accent text-accent">
                                    <Lightbulb className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase bg-foreground text-white px-2 py-0.5">
                                            {puzzle.difficulty}
                                        </span>
                                        <span className="text-[10px] font-black uppercase bg-muted text-foreground px-2 py-0.5">
                                            {puzzle.gridSize}x{puzzle.gridSize}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-display font-black uppercase text-foreground mb-1">{puzzle.description}</h3>
                                    <p className="text-muted-foreground font-bold text-sm">Goal: Score {puzzle.targetScore} SOS in {puzzle.movesAllowed} move{puzzle.movesAllowed > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => playPuzzle(puzzle)}
                                className="p-4 border-4 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                            >
                                <Play className="w-8 h-8 fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
