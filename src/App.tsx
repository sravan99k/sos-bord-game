import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import SOSSetup from "./pages/SOSSetup";
import SOSGame from "./pages/SOSGame";
import SOSPuzzles from "./pages/SOSPuzzles";
import TombolaAuth from "./pages/TombolaAuth";
import TombolaLobby from "./pages/TombolaLobby";
import TombolaRoom from "./pages/TombolaRoom";
import TombolaGame from "./pages/TombolaGame";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: 'hsl(220 18% 10%)',
            border: '1px solid hsl(220 15% 20%)',
            color: 'hsl(210 40% 98%)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sos/setup" element={<SOSSetup />} />
        <Route path="/sos/game" element={<SOSGame />} />
        <Route path="/sos/puzzles" element={<SOSPuzzles />} />
        <Route path="/tombola" element={<TombolaAuth />} />
        <Route path="/tombola/lobby" element={<TombolaLobby />} />
        <Route path="/tombola/room/:roomCode" element={<TombolaRoom />} />
        <Route path="/tombola/game/:roomCode" element={<TombolaGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
