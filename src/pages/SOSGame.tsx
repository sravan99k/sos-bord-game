import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trophy, Lightbulb, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface Player {
  name: string;
  color: string;
  colorClass: string;
  isAI: boolean;
}

interface Cell {
  value: 'S' | 'O' | null;
  playerIndex: number | null;
}

interface SOSLine {
  cells: [number, number][];
  playerIndex: number;
}

export default function SOSGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { players = [], gridSize = 5, puzzleMode = false, puzzleTarget = 0, initialGrid = null } = (location.state as {
    players: Player[];
    gridSize: number;
    puzzleMode?: boolean;
    puzzleTarget?: number;
    initialGrid?: Cell[][];
  }) || {};

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<'S' | 'O'>('S');
  const [scores, setScores] = useState<number[]>([]);
  const [sosLines, setSOSLines] = useState<SOSLine[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  const clickTimerRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const [history, setHistory] = useState<{
    grid: Cell[][];
    scores: number[];
    sosLines: SOSLine[];
    currentPlayer: number;
  }[]>([]);

  useEffect(() => {
    if (!players.length && !puzzleMode) {
      navigate('/sos/setup');
      return;
    }
    resetGame();
  }, [players, gridSize, initialGrid]);

  const resetGame = () => {
    if (initialGrid) {
      setGrid(initialGrid.map(row => row.map(cell => ({ ...cell }))));
    } else {
      setGrid(
        Array(gridSize).fill(null).map(() =>
          Array(gridSize).fill(null).map(() => ({ value: null, playerIndex: null }))
        )
      );
    }
    setScores(Array(players.length).fill(0));
    setSOSLines([]);
    setHistory([]);
    setCurrentPlayer(0);
    setGameOver(false);
    setWinner(null);
  };

  const playSfx = (type: 'place' | 'score' | 'win') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'place') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
      } else if (type === 'score') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      }
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) { }
  };

  const checkForSOS = useCallback((newGrid: Cell[][], row: number, col: number, playerIndex: number, existingLines: SOSLine[]): SOSLine[] => {
    const newLines: SOSLine[] = [];
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    const cell = newGrid[row]?.[col];
    if (!cell) return [];

    const isSameLine = (l1: [number, number][], l2: [number, number][]) => {
      const s1 = [...l1].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(c => `${c[0]},${c[1]}`).join('|');
      const s2 = [...l2].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(c => `${c[0]},${c[1]}`).join('|');
      return s1 === s2;
    };

    const lineExists = (cells: [number, number][]) => {
      return existingLines.some(l => isSameLine(l.cells, cells)) ||
        newLines.some(l => isSameLine(l.cells, cells));
    };

    for (const [dr, dc] of directions) {
      if (cell.value === 'O') {
        const pR = row - dr!, pC = col - dc!, nR = row + dr!, nC = col + dc!;
        if (newGrid[pR]?.[pC]?.value === 'S' && newGrid[nR]?.[nC]?.value === 'S') {
          const cells: [number, number][] = [[pR, pC], [row, col], [nR, nC]];
          if (!lineExists(cells)) newLines.push({ cells, playerIndex });
        }
      } else if (cell.value === 'S') {
        const mR = row + dr!, mC = col + dc!, eR = row + 2 * dr!, eC = col + 2 * dc!;
        if (newGrid[mR]?.[mC]?.value === 'O' && newGrid[eR]?.[eC]?.value === 'S') {
          const cells: [number, number][] = [[row, col], [mR, mC], [eR, eC]];
          if (!lineExists(cells)) newLines.push({ cells, playerIndex });
        }
        const mR2 = row - dr!, mC2 = col - dc!, sR = row - 2 * dr!, sC = col - 2 * dc!;
        if (newGrid[mR2]?.[mC2]?.value === 'O' && newGrid[sR]?.[sC]?.value === 'S') {
          const cells: [number, number][] = [[sR, sC], [mR2, mC2], [row, col]];
          if (!lineExists(cells)) newLines.push({ cells, playerIndex });
        }
      }
    }
    return newLines;
  }, []);

  const makeMove = useCallback((row: number, col: number, letter: 'S' | 'O') => {
    if (grid[row]?.[col]?.value !== null) return;

    setHistory(prev => [...prev, {
      grid: grid.map(r => r.map(c => ({ ...c }))),
      scores: [...scores],
      sosLines: [...sosLines],
      currentPlayer
    }]);

    playSfx('place');
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = { value: letter, playerIndex: currentPlayer };

    const newSOSLines = checkForSOS(newGrid, row, col, currentPlayer, sosLines);
    const totalNewLines = [...sosLines, ...newSOSLines];

    setGrid(newGrid);
    setSOSLines(totalNewLines);

    let updatedScores = [...scores];
    if (newSOSLines.length > 0) {
      playSfx('score');
      updatedScores[currentPlayer] = (updatedScores[currentPlayer] ?? 0) + newSOSLines.length;
      setScores(updatedScores);
      toast.success(`${players[currentPlayer]?.name} scored ${newSOSLines.length} SOS!`, { icon: '✏️' });

      if (puzzleMode && updatedScores[currentPlayer]! >= puzzleTarget) {
        setWinner(currentPlayer);
        setGameOver(true);
        return;
      }
    } else {
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }

    const isFull = newGrid.every(r => r.every(c => c.value !== null));
    if (isFull) {
      setGameOver(true);
      const maxScore = Math.max(...updatedScores);
      const winners = updatedScores.map((s, i) => ({ s, i })).filter(x => x.s === maxScore);
      if (winners.length === 1) setWinner(winners[0]!.i);
    }
  }, [grid, currentPlayer, players, scores, sosLines, checkForSOS, puzzleMode, puzzleTarget]);

  useEffect(() => {
    if (gameOver || !players[currentPlayer]?.isAI) return;

    const timer = setTimeout(() => {
      const emptyCells: [number, number][] = [];
      grid.forEach((row, r) => row.forEach((cell, c) => {
        if (cell.value === null) emptyCells.push([r, c]);
      }));
      if (emptyCells.length === 0) return;

      const difficulty = (location.state as any)?.difficulty || 'Medium';
      let bestMove: { r: number, c: number, l: 'S' | 'O' } | null = null;
      let scoringMoves: { r: number, c: number, l: 'S' | 'O', gain: number }[] = [];

      for (const [r, c] of emptyCells) {
        for (const l of ['S', 'O'] as const) {
          const testGrid = grid.map(row => row.map(cell => ({ ...cell })));
          testGrid[r]![c] = { value: l, playerIndex: currentPlayer };
          const lines = checkForSOS(testGrid, r, c, currentPlayer, sosLines);
          if (lines.length > 0) scoringMoves.push({ r, c, l, gain: lines.length });
        }
      }

      if (scoringMoves.length > 0 && difficulty !== 'Easy') {
        scoringMoves.sort((a, b) => b.gain - a.gain);
        bestMove = scoringMoves[0]!;
      }

      if (bestMove) {
        makeMove(bestMove.r, bestMove.c, bestMove.l);
        return;
      }

      if (difficulty !== 'Easy') {
        const safeMoves: { r: number, c: number, l: 'S' | 'O' }[] = [];
        for (const [r, c] of emptyCells) {
          for (const l of ['S', 'O'] as const) {
            const testGrid = grid.map(row => row.map(cell => ({ ...cell })));
            testGrid[r]![c] = { value: l, playerIndex: currentPlayer };
            let givesOpponentChance = false;
            const nextEmpty = emptyCells.filter(cell => cell[0] !== r || cell[1] !== c);
            for (const [nr, nc] of nextEmpty.slice(0, 15)) {
              for (const nl of ['S', 'O'] as const) {
                const testGridFinal = testGrid.map(row => row.map(cell => ({ ...cell })));
                testGridFinal[nr]![nc] = { value: nl, playerIndex: (currentPlayer + 1) % players.length };
                if (checkForSOS(testGridFinal, nr, nc, (currentPlayer + 1) % players.length, sosLines).length > 0) {
                  givesOpponentChance = true; break;
                }
              }
              if (givesOpponentChance) break;
            }
            if (!givesOpponentChance) safeMoves.push({ r, c, l });
          }
        }
        if (safeMoves.length > 0) {
          const move = safeMoves[Math.floor(Math.random() * safeMoves.length)]!;
          makeMove(move.r, move.c, move.l);
          return;
        }
      }

      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)]!;
      makeMove(r, c, Math.random() > 0.5 ? 'S' : 'O');
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPlayer, gameOver, grid, players, checkForSOS, makeMove, sosLines, location.state]);

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || grid[r]?.[c]?.value !== null || players[currentPlayer]?.isAI) return;
    const key = `${r}-${c}`;
    if (clickTimerRef.current[key]) {
      clearTimeout(clickTimerRef.current[key]);
      delete clickTimerRef.current[key];
      makeMove(r, c, selectedLetter === 'S' ? 'O' : 'S');
    } else {
      clickTimerRef.current[key] = setTimeout(() => {
        delete clickTimerRef.current[key];
        makeMove(r, c, selectedLetter);
      }, 250);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || players[currentPlayer]?.isAI) return;
    const lastState = history[history.length - 1];
    if (!lastState) return;
    setGrid(lastState.grid);
    setScores(lastState.scores);
    setSOSLines(lastState.sosLines);
    setCurrentPlayer(lastState.currentPlayer);
    setHistory(prev => prev.slice(0, -1));
    setGameOver(false);
    setWinner(null);
  };

  const PlayerCard = ({ index }: { index: number }) => {
    const p = players[index];
    if (!p) return null;
    return (
      <div className={`relative p-3 border-4 transition-all duration-300 w-32 md:w-40 ${currentPlayer === index ? "border-primary bg-primary/5 -translate-y-1 shadow-[4px_4px_0px_#000]" : "border-foreground bg-white"}`}>
        {currentPlayer === index && <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rotate-12 border-2 border-foreground animate-bounce">TURN</div>}
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-foreground shadow-[1px_1px_0px_#000]" style={{ backgroundColor: p.color }} />
          <span className="font-black text-[10px] uppercase truncate opacity-70">{p.name}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl md:text-3xl font-black text-primary leading-none tabular-nums">{scores[index]}</span>
          {p.isAI && <span className="text-[8px] font-black bg-foreground text-white px-1">AI</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] relative overflow-hidden font-body text-foreground flex flex-col">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 py-4 flex-1 flex flex-col min-h-0">
        <header className="flex items-center justify-between mb-4 border-b-4 border-foreground pb-2 shrink-0">
          <button onClick={() => navigate('/')} className="p-2 border-4 border-transparent hover:border-foreground transition-all">
            <ArrowLeft className="w-7 h-7" />
          </button>

          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl md:text-4xl font-black text-primary tracking-tight uppercase italic leading-tight">SOS GAME</h1>
          </div>

          <div className="flex gap-2">
            <button onClick={handleUndo} disabled={history.length === 0 || players[currentPlayer]?.isAI} title="Undo Move" className={`p-2 border-4 border-transparent transition-all ${history.length === 0 || players[currentPlayer]?.isAI ? 'opacity-20 cursor-not-allowed' : 'hover:border-foreground active:translate-y-0.5'}`}><Undo2 className="w-6 h-6 md:w-7 md:h-7" /></button>
            <button onClick={resetGame} title="Restart Game" className="p-2 border-4 border-transparent hover:border-foreground transition-all active:translate-y-0.5"><RotateCcw className="w-6 h-6 md:w-7 md:h-7" /></button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center min-h-0">
          <div className="mb-6 flex flex-col items-center gap-2 shrink-0 animate-in slide-in-from-top-4 duration-500">
            <div className="flex gap-4">
              {(['S', 'O'] as const).map((l) => (
                <button key={l} onClick={() => setSelectedLetter(l)} className={`w-14 h-14 md:w-16 md:h-16 border-4 font-black transition-all relative ${selectedLetter === l ? "bg-primary text-white border-primary -translate-y-2 shadow-[8px_8px_0px_#000]" : "bg-white border-foreground hover:bg-muted text-foreground"}`}>
                  <span className="text-2xl md:text-3xl">{l}</span>
                  {selectedLetter === l && <div className="absolute -bottom-2 -left-2 -right-2 h-1 bg-white/20 animate-pulse" />}
                </button>
              ))}
            </div>
            <div className="text-center group cursor-help">
              <p className="text-[10px] font-black uppercase text-foreground/60 tracking-widest bg-white/50 px-3 py-1 border-2 border-foreground/10 rounded-full">
                Tap grid for <span className="text-primary font-black">{selectedLetter}</span> • Double-tap for <span className="text-primary font-black">{selectedLetter === 'S' ? 'O' : 'S'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-full min-h-0">
            <div className="hidden lg:flex flex-col gap-4 animate-in slide-in-from-left-4 duration-500">
              <PlayerCard index={0} />
              {players.length > 2 && <PlayerCard index={2} />}
            </div>

            <div className="lg:hidden flex flex-wrap gap-2 justify-center mb-4">
              {players.map((_, i) => <PlayerCard key={i} index={i} />)}
            </div>

            {/* Battle Box Container */}
            <div
              className="relative border-8 border-foreground bg-white shadow-[12px_12px_0px_rgba(0,0,0,0.1)] md:shadow-[20px_20px_0px_rgba(0,0,0,0.1)] transition-transform duration-500"
              style={{
                width: '90vw',
                height: '90vw',
                maxWidth: 'min(580px, 60vh)',
                maxHeight: 'min(580px, 60vh)',
                aspectRatio: '1/1'
              }}
            >
              {/* Inner relative container to perfectly align SVG with Cells, ignoring the 8px border of the parent */}
              <div className="relative w-full h-full grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}>
                {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                  const r = Math.floor(i / gridSize);
                  const c = i % gridSize;
                  const cell = grid[r]?.[c] || { value: null, playerIndex: null };
                  return (
                    <button key={`${r}-${c}`} disabled={cell.value !== null || gameOver || (players[currentPlayer]?.isAI)} onClick={() => handleCellClick(r, c)} className={`relative border border-foreground/10 flex items-center justify-center transition-all group p-0 overflow-hidden ${!cell.value && !gameOver ? 'hover:bg-primary/5' : ''}`}>
                      {cell.value && (
                        <span className="font-black animate-scale-in leading-none select-none drop-shadow-sm" style={{ color: players[cell.playerIndex!]?.color || 'currentColor', fontSize: `calc(100% * 0.7)` }}>{cell.value}</span>
                      )}
                      {!cell.value && !gameOver && !players[currentPlayer]?.isAI && (
                        <span className="opacity-0 group-hover:opacity-20 font-black select-none transition-opacity duration-150" style={{ fontSize: `calc(100% * 0.5)` }}>{selectedLetter}</span>
                      )}
                    </button>
                  );
                })}

                {/* SVG Overlay: Now perfectly localized to the grid container's inner content area */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full z-20 overflow-visible">
                  {sosLines.map((line, idx) => {
                    const sCol = line.cells[0][1], sRow = line.cells[0][0];
                    const eCol = line.cells[2][1], eRow = line.cells[2][0];
                    const unit = 100 / gridSize;
                    // Logic: Calculate exact cell center relative to the 100% width/height of this container
                    const x1 = (sCol + 0.5) * unit;
                    const y1 = (sRow + 0.5) * unit;
                    const x2 = (eCol + 0.5) * unit;
                    const y2 = (eRow + 0.5) * unit;

                    const color = players[line.playerIndex]?.color || 'currentColor';
                    return (
                      <g key={idx}>
                        <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={color} strokeWidth="6" strokeLinecap="round" className="opacity-15 blur-sm" />
                        <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={color} strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: '100', strokeDashoffset: '100', animation: 'draw 0.4s ease-out forwards' }} />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4 animate-in slide-in-from-right-4 duration-500">
              <PlayerCard index={1} />
              {players.length > 3 && <PlayerCard index={3} />}
            </div>
          </div>
        </main>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-500">
          <div className="bg-white p-10 border-8 border-foreground max-w-sm w-full text-center shadow-[24px_24px_0px_rgba(0,0,0,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-accent/10 border-4 border-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"><Trophy className="w-10 h-10 text-accent" /></div>
              <h2 className="text-4xl font-display font-black mb-2 uppercase italic tracking-tight">Game Over</h2>
              <div className="py-6 border-y-4 border-foreground/5 mb-8">
                {winner !== null ? (
                  <>
                    <p className="text-xs font-black uppercase text-foreground/40 mb-2">Grand Champion</p>
                    <p className="text-3xl font-black" style={{ color: players[winner]?.color }}>{players[winner]?.name}</p>
                    <p className="text-sm font-bold text-foreground/60 mt-1 uppercase">With {scores[winner]} SOS Lines!</p>
                  </>
                ) : (
                  <p className="text-2xl font-black uppercase italic tracking-widest py-4">It's a Draw Match!</p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={resetGame} className="w-full py-5 bg-primary text-white font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[8px_8px_0px_rgba(var(--primary-rgb),0.2)] border-4 border-primary">REPLAY MISSION</button>
                <button onClick={() => navigate('/')} className="w-full py-5 border-4 border-foreground font-black text-xl hover:bg-muted active:scale-[0.98] transition-all">BACK TO BASE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
