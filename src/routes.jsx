import { lazy } from 'react';

// Lazy-loaded page components for code splitting
export const LandingPage    = lazy(() => import('./pages/LandingPage'));
export const CreateRoom     = lazy(() => import('./pages/CreateRoom'));
export const JoinRoom       = lazy(() => import('./pages/JoinRoom'));
export const Lobby          = lazy(() => import('./pages/Lobby'));
export const WordReveal     = lazy(() => import('./pages/WordReveal'));
export const ClueSubmission = lazy(() => import('./pages/ClueSubmission'));
export const ClueReveal     = lazy(() => import('./pages/ClueReveal'));
export const Discussion     = lazy(() => import('./pages/Discussion'));
export const Voting         = lazy(() => import('./pages/Voting'));
export const Elimination    = lazy(() => import('./pages/Elimination'));
export const Results        = lazy(() => import('./pages/Results'));
export const Leaderboard    = lazy(() => import('./pages/Leaderboard'));
export const Profile        = lazy(() => import('./pages/Profile'));
export const Auth           = lazy(() => import('./pages/Auth'));
