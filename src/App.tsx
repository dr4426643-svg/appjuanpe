/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DEFAULT_CLUB_SETTINGS, 
  WEEKLY_WORKOUTS, 
  INITIAL_PLAYERS, 
  INITIAL_MATCHES,
  DRILLS_3D 
} from './data/basketballData';
import { 
  ClubSettings, 
  DailyWorkout, 
  PlayerRecord, 
  BasketballMatch,
  Drill3D 
} from './types/basketball';
import { soundEffects } from './utils/audio';
import { HomeHub } from './components/HomeHub';
import { Module1Trainings } from './components/Module1Trainings';
import { Module2Attendance } from './components/Module2Attendance';
import { Module3LiveScorer } from './components/Module3LiveScorer';
import { Module4Stats } from './components/Module4Stats';
import { Court3D } from './components/Court3D';
import { ClubSettingsModal } from './components/ClubSettingsModal';
import { 
  Home,
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  Volume2, 
  VolumeX, 
  Settings, 
  ArrowLeft
} from 'lucide-react';

export default function App() {
  // Global Application State
  const [settings, setSettings] = useState<ClubSettings>(DEFAULT_CLUB_SETTINGS);
  const [workouts, setWorkouts] = useState<DailyWorkout[]>(WEEKLY_WORKOUTS);
  const [players, setPlayers] = useState<PlayerRecord[]>(INITIAL_PLAYERS);
  const [matches, setMatches] = useState<BasketballMatch[]>(INITIAL_MATCHES);

  // Active View State: 'home' | 'module1' | 'module2' | 'module3' | 'module4' | 'court3d'
  const [currentView, setCurrentView] = useState<'home' | 'module1' | 'module2' | 'module3' | 'module4' | 'court3d'>('home');
  const [currentDrill, setCurrentDrill] = useState<Drill3D>(DRILLS_3D[0]);

  // Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playWhistle(0.2);
  };

  const handleUpdateWorkout = (updatedWorkout: DailyWorkout) => {
    setWorkouts(prev => prev.map(w => w.day === updatedWorkout.day ? updatedWorkout : w));
  };

  const handleSaveFinishedMatch = (newMatch: BasketballMatch) => {
    setMatches(prev => [newMatch, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-[#f8fafc] to-slate-100/70 text-slate-900 flex flex-col items-center selection:bg-blue-600 selection:text-white font-sans relative">
      
      {/* Top Application Header Bar: Clean & Minimal (Removed the Volver / Eye button) */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-blue-600 bg-white shadow-sm shrink-0 p-0.5">
              <img
                src={settings.logoUrl}
                alt={settings.teamName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/survivors_team_crest_1793843097650.jpg';
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-blue-700 uppercase block">
                SURVIVORS MELLADO
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                {settings.teamName}
              </h1>
            </div>
          </div>

          {/* Header Right Actions: Audio and Settings only (NO extra eye/volver button) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
              title={soundEnabled ? 'Silbato activado' : 'Silencio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => {
                soundEffects.playBounce();
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
              title="Ajustes del Club"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Fluid Responsive Content Area (with bottom padding for navigation bar) */}
      <main className="w-full max-w-5xl px-3 sm:px-6 py-4 flex-1 pb-24">
        
        {/* VIEW 1: HOME HUB */}
        {currentView === 'home' && (
          <HomeHub
            settings={settings}
            workouts={workouts}
            players={players}
            matches={matches}
            onSelectModule={(mod) => {
              if (mod === 1) setCurrentView('module1');
              if (mod === 2) setCurrentView('module2');
              if (mod === 3) setCurrentView('module3');
              if (mod === 4) setCurrentView('module4');
            }}
            onOpenCourt3D={() => setCurrentView('court3d')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* VIEW 2: MÓDULO 1 - ENTRENAMIENTOS POR DÍA */}
        {currentView === 'module1' && (
          <div className="w-full">
            <Module1Trainings
              workouts={workouts}
              onUpdateWorkout={handleUpdateWorkout}
              onOpenCourt3D={() => setCurrentView('court3d')}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {/* VIEW 3: MÓDULO 2 - REGISTRO Y ASISTENCIA */}
        {currentView === 'module2' && (
          <div className="w-full">
            <Module2Attendance
              players={players}
              onUpdatePlayers={setPlayers}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {/* VIEW 4: MÓDULO 3 - MARCADOR EN VIVO INTUITIVO */}
        {currentView === 'module3' && (
          <div className="w-full">
            <Module3LiveScorer
              settings={settings}
              players={players}
              onSaveFinishedMatch={handleSaveFinishedMatch}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {/* VIEW 5: MÓDULO 4 - ESTADÍSTICAS E HISTORIAL */}
        {currentView === 'module4' && (
          <div className="w-full">
            <Module4Stats
              matches={matches}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        )}

        {/* VIEW 6: CANCHA 3D INTERACTIVA (CANCHA COMPLETA) */}
        {currentView === 'court3d' && (
          <div className="w-full h-[620px] sm:h-[700px] rounded-3xl overflow-hidden border border-blue-200 shadow-2xl relative flex flex-col bg-slate-950">
            <Court3D
              currentDrill={currentDrill}
              onSelectDrill={setCurrentDrill}
              allDrills={DRILLS_3D}
              onBackToHome={() => setCurrentView('home')}
              onStartRoutineWithDrill={() => {
                setCurrentView('module1');
              }}
            />
          </div>
        )}
      </main>

      {/* BARRA INFERIOR ANDROID NATIVA (BOTTOM NAVIGATION BAR) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
        <div className="max-w-md mx-auto h-16 grid grid-cols-5 items-center px-1">
          
          {/* TAB 1: INICIO */}
          <button
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('home');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              currentView === 'home'
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === 'home' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Inicio</span>
          </button>

          {/* TAB 2: ENTRENAR (MÓDULO 1) */}
          <button
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('module1');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              currentView === 'module1'
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === 'module1' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Entrenar</span>
          </button>

          {/* TAB 3: PLANTEL (MÓDULO 2) */}
          <button
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('module2');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              currentView === 'module2'
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === 'module2' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Plantel</span>
          </button>

          {/* TAB 4: MARCADOR (MÓDULO 3) */}
          <button
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('module3');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              currentView === 'module3'
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === 'module3' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Marcador</span>
          </button>

          {/* TAB 5: RÉCORD (MÓDULO 4) */}
          <button
            onClick={() => {
              soundEffects.playBounce();
              setCurrentView('module4');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-all ${
              currentView === 'module4'
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${currentView === 'module4' ? 'bg-blue-50 text-blue-600' : ''}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Récord</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal (Including SQL & PHP Download) */}
      {isSettingsOpen && (
        <ClubSettingsModal
          settings={settings}
          workouts={workouts}
          players={players}
          matches={matches}
          onSaveSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
