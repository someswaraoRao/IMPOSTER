import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameProvider';
import { ToastProvider } from './components/common/Toast';
import StarsBackground from './components/Effects/StarsBackground';
import NebulaBackground from './components/Effects/NebulaBackground';
import Confetti from './components/Effects/Confetti';

import {
  LandingPage,
  CreateRoom,
  JoinRoom,
  Lobby,
  WordReveal,
  ClueSubmission,
  ClueReveal,
  Discussion,
  Voting,
  Elimination,
  Results,
  Leaderboard,
  Profile,
  Auth,
} from './routes';

// Fallback while lazy pages load
function PageLoader() {
  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="dots"><span /><span /><span /></div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <ToastProvider>
          {/* Persistent background effects */}
          <StarsBackground />
          <NebulaBackground />
          <Confetti />

          {/* Routes */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"             element={<LandingPage />} />
              <Route path="/create"       element={<CreateRoom />} />
              <Route path="/join"         element={<JoinRoom />} />
              <Route path="/lobby"        element={<Lobby />} />
              <Route path="/word-reveal"  element={<WordReveal />} />
              <Route path="/clue-submit"  element={<ClueSubmission />} />
              <Route path="/clue-reveal"  element={<ClueReveal />} />
              <Route path="/discussion"   element={<Discussion />} />
              <Route path="/voting"       element={<Voting />} />
              <Route path="/elimination"  element={<Elimination />} />
              <Route path="/results"      element={<Results />} />
              <Route path="/leaderboard"  element={<Leaderboard />} />
              <Route path="/profile"      element={<Profile />} />
              <Route path="/auth"         element={<Auth />} />
              {/* Catch-all → landing */}
              <Route path="*"             element={<LandingPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </GameProvider>
    </BrowserRouter>
  );
}
