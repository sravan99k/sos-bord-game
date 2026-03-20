import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Volume2, Trophy, Home } from "lucide-react";
import { toast } from "sonner";
import { generateTombolaTicket, shuffleArray } from "@/lib/utils";

export default function TombolaGame() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<number[][]>([]);
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [allNumbers] = useState(() => shuffleArray(Array.from({ length: 90 }, (_, i) => i + 1)));
  const [numberIndex, setNumberIndex] = useState(0);
  const [linesCompleted, setLinesCompleted] = useState(0);
  const [hasFullHouse, setHasFullHouse] = useState(false);

  useEffect(() => {
    setTicket(generateTombolaTicket());
  }, []);

  // Call new number every 10 seconds
  useEffect(() => {
    if (gameOver || hasFullHouse) return;
    
    const callNumber = () => {
      if (numberIndex >= allNumbers.length) { setGameOver(true); return; }
      const num = allNumbers[numberIndex];
      if (num !== undefined) {
        setCurrentNumber(num);
        setCalledNumbers(prev => [...prev, num]);
        setNumberIndex(prev => prev + 1);
        setTimeLeft(10);
      }
    };
    
    callNumber();
    const interval = setInterval(callNumber, 10000);
    return () => clearInterval(interval);
  }, [numberIndex, allNumbers, gameOver, hasFullHouse]);

  // Countdown timer
  useEffect(() => {
    if (gameOver || !currentNumber) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 10;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentNumber, gameOver]);

  const markNumber = useCallback((num: number) => {
    if (!calledNumbers.includes(num) || markedNumbers.has(num)) return;
    
    const newMarked = new Set(markedNumbers);
    newMarked.add(num);
    setMarkedNumbers(newMarked);
    
    // Check for line completion
    let lines = 0;
    let fullHouse = true;
    ticket.forEach(row => {
      const rowNumbers = row.filter(n => n > 0);
      const allMarked = rowNumbers.every(n => newMarked.has(n));
      if (allMarked && rowNumbers.length > 0) lines++;
      if (!allMarked) fullHouse = false;
    });
    
    if (lines > linesCompleted) {
      setLinesCompleted(lines);
      toast.success(`Line ${lines} completed!`);
    }
    
    if (fullHouse) {
      setHasFullHouse(true);
      setGameOver(true);
      toast.success("🎉 FULL HOUSE! You win!");
    }
  }, [calledNumbers, markedNumbers, ticket, linesCompleted]);

  const ticketNumbers = ticket.flat().filter(n => n > 0);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern p-4">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/tombola/lobby")} className="p-2 rounded-lg bg-muted/50 hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm text-muted-foreground">Room: {roomCode}</div>
          <Volume2 className="w-5 h-5 text-primary" />
        </header>

        {/* Current Number */}
        <div className="game-card p-6 mb-4 text-center">
          <p className="text-muted-foreground text-sm mb-2">Current Number</p>
          {currentNumber && !gameOver ? (
            <>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center animate-number-pop mb-3">
                <span className="font-display text-5xl font-black">{currentNumber}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-8 h-8 rounded-full border-4 border-primary flex items-center justify-center font-display font-bold ${timeLeft <= 3 ? "animate-countdown-pulse text-destructive border-destructive" : ""}`}>
                  {timeLeft}
                </div>
                <span className="text-sm text-muted-foreground">seconds left</span>
              </div>
            </>
          ) : (
            <div className="text-2xl text-muted-foreground">Game Over</div>
          )}
        </div>

        {/* Called Numbers */}
        <div className="game-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">Called ({calledNumbers.length}/90)</p>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-hide">
            {calledNumbers.slice(-20).map(num => (
              <span key={num} className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-display font-bold ${
                markedNumbers.has(num) ? "bg-primary/20 text-primary" : "bg-muted/50"
              }`}>{num}</span>
            ))}
          </div>
        </div>

        {/* Ticket */}
        <div className="game-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Your Ticket</p>
            <div className="text-xs text-muted-foreground">Lines: {linesCompleted}/3</div>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {ticket.map((row, r) =>
              row.map((num, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => num > 0 && markNumber(num)}
                  disabled={num === 0 || !calledNumbers.includes(num) || markedNumbers.has(num)}
                  className={`aspect-square rounded-md flex items-center justify-center text-xs sm:text-sm font-display font-bold transition-all ${
                    num === 0
                      ? "bg-transparent"
                      : markedNumbers.has(num)
                      ? "tombola-number-marked"
                      : calledNumbers.includes(num)
                      ? "tombola-number-unmarked ring-2 ring-accent animate-pulse"
                      : "tombola-number-unmarked opacity-60"
                  }`}
                >
                  {num > 0 ? num : ""}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="game-card p-3">
            <p className="text-xs text-muted-foreground">Marked</p>
            <p className="font-display font-bold text-primary">{markedNumbers.size}/{ticketNumbers.length}</p>
          </div>
          <div className="game-card p-3">
            <p className="text-xs text-muted-foreground">Lines</p>
            <p className="font-display font-bold text-accent">{linesCompleted}</p>
          </div>
          <div className="game-card p-3">
            <p className="text-xs text-muted-foreground">Called</p>
            <p className="font-display font-bold">{calledNumbers.length}</p>
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="game-card p-8 text-center max-w-sm w-full animate-scale-in">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${hasFullHouse ? "text-neon-yellow" : "text-muted-foreground"}`} />
              <h2 className="font-display text-2xl font-bold mb-2">{hasFullHouse ? "You Win! 🎉" : "Game Over"}</h2>
              <p className="text-muted-foreground mb-6">Lines completed: {linesCompleted}/3</p>
              <button onClick={() => navigate("/tombola/lobby")} className="w-full btn-neon flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Back to Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
