import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function TombolaAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    localStorage.setItem("tombolaUser", JSON.stringify({ name, coins: 100 }));
    toast.success(`Welcome, ${name}!`);
    navigate("/tombola/lobby");
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="game-card p-6 animate-scale-in">
          <h1 className="font-display text-2xl font-bold text-center mb-6">
            {isLogin ? "Login to Tombola" : "Create Account"}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none"
              />
            </div>
            
            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none"
                />
              </div>
            )}
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none"
              />
            </div>
            
            <button type="submit" className="w-full btn-neon bg-accent py-3">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
          
          <p className="text-center text-muted-foreground mt-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
          
          <div className="mt-4 p-3 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20 text-center">
            <span className="text-neon-yellow text-sm">🎁 New users get 100 free coins!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
