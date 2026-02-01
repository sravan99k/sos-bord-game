import { useNavigate } from "react-router-dom";
import { Grid3X3, Users, Sparkles, Bot, Lightbulb, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();

  const playVsAI = () => {
    // Navigate to setup but maybe pre-set AI mode if we passed state?
    // For now, just go to Setup as the user specifically requested options (grid, difficulty)
    navigate('/sos/setup');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] relative overflow-hidden font-body text-foreground">
      {/* Subtle paper texture effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(var(--foreground)/0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <h1 className="font-display text-5xl md:text-7xl font-black text-primary tracking-tighter uppercase">
              GAME<span className="text-accent underline decoration-4 underline-offset-8">ZONE</span>
            </h1>
            <div className="h-1.5 w-40 bg-primary/20 rounded-full mt-4" />
          </div>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
            Classic strategy and logic games, reimagined with a timeless paper & ink feel.
          </p>
        </header>

        {/* Game Selection */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
            {/* SOS Game Category */}
            <div className="p-8 border-4 border-foreground bg-white shadow-[16px_16px_0px_rgba(0,0,0,0.1)] flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-primary/5 border-4 border-primary/20">
                  <Grid3X3 className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-4xl font-black text-foreground">SOS</h2>
                  <p className="text-muted-foreground font-bold">THE GRID BATTLE</p>
                </div>
              </div>

              <div className="grid gap-4 flex-1">
                <button
                  onClick={playVsAI}
                  className="group flex items-center justify-between p-5 border-4 border-primary hover:bg-primary hover:text-white transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <Bot className="w-8 h-8" />
                    <span className="text-xl font-black">VS COMPUTER</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/sos/setup')}
                  className="group flex items-center justify-between p-5 border-4 border-primary hover:bg-primary hover:text-white transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8" />
                    <span className="text-xl font-black">VS FRIENDS</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all" />
                </button>

                <button
                  onClick={() => toast.info("Daily Puzzles are coming soon!")}
                  className="group flex items-center justify-between p-5 border-4 border-muted text-muted-foreground cursor-not-allowed text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter">Coming Soon</div>
                  <div className="flex items-center gap-4">
                    <Lightbulb className="w-8 h-8 opacity-40" />
                    <span className="text-xl font-black">DAILY PUZZLES</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tombola Category */}
            <div className="p-8 border-4 border-foreground bg-white shadow-[16px_16px_0px_rgba(0,0,0,0.1)] flex flex-col opacity-80">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-secondary/5 border-4 border-secondary/20">
                  <Sparkles className="w-12 h-12 text-secondary opacity-40" />
                </div>
                <div>
                  <h2 className="font-display text-4xl font-black text-foreground">TOMBOLA</h2>
                  <p className="text-muted-foreground font-bold">COMING SOON</p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6 flex-1">
                <p className="text-muted-foreground font-medium text-lg italic">
                  The ultimate social number game is under construction. Get ready for the house!
                </p>

                <button
                  disabled
                  className="py-6 border-4 border-muted font-display font-black text-2xl text-muted-foreground cursor-not-allowed bg-muted/5 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-accent text-white text-[8px] font-black px-2 py-0.5 uppercase">STAY TUNED</div>
                  LOCKED
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm py-12 border-t-2 border-border/50 mt-12">
          <p className="font-bold text-lg mb-2 italic">"Pencil and paper, but better."</p>

        </footer>
      </div>
    </div>
  );
}
