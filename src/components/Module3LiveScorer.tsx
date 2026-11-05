import React, { useState, useEffect } from 'react';
import { BasketballMatch, PlayerRecord, PlayerInMatch, ClubSettings } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Undo2, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  Flame, 
  AlertCircle,
  Volume2
} from 'lucide-react';

interface Module3LiveScorerProps {
  settings: ClubSettings;
  players: PlayerRecord[];
  onSaveFinishedMatch: (match: BasketballMatch) => void;
  onBackToHome: () => void;
}

interface ActionLogItem {
  id: string;
  time: string;
  text: string;
  playerId?: string;
  pointsAdded?: number;
  isFoul?: boolean;
  team: 'home' | 'away';
}

export const Module3LiveScorer: React.FC<Module3LiveScorerProps> = ({
  settings,
  players,
  onSaveFinishedMatch,
  onBackToHome
}) => {
  // Team names
  const [homeTeam, setHomeTeam] = useState<string>(settings.teamName);
  const [awayTeam, setAwayTeam] = useState<string>('Rival Visitante');
  const [location, setLocation] = useState<string>('Gimnasio Mellado');

  // Score & Quarter
  const [homeScore, setHomeScore] = useState<number>(68);
  const [awayScore, setAwayScore] = useState<number>(64);
  const [quarter, setQuarter] = useState<number>(4);
  const [secondsLeft, setSecondsLeft] = useState<number>(240); // 4:00
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Play-by-play action log with Undo support
  const [actionLog, setActionLog] = useState<ActionLogItem[]>([
    { id: '1', time: '04:12', text: 'Triple (+3) de Javier Santos #23', playerId: 'p_2', pointsAdded: 3, team: 'home' },
    { id: '2', time: '03:45', text: 'Canasta (+2) de Titanes', pointsAdded: 2, team: 'away' },
  ]);

  // Players on court
  const [rosterStats, setRosterStats] = useState<PlayerInMatch[]>(
    players.slice(0, 5).map((p, idx) => ({
      playerId: p.id,
      name: p.fullName,
      dorsal: p.dorsal,
      position: p.position,
      points: [18, 16, 14, 12, 8][idx] || 4,
      fouls: [2, 3, 1, 4, 2][idx] || 1,
      rebounds: [4, 6, 12, 5, 2][idx] || 2,
      assists: [7, 3, 1, 2, 4][idx] || 1
    }))
  );

  // Clock interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEffects.playBuzzer(1.2);
            return 0;
          }
          if (prev <= 4 && prev > 1) soundEffects.playBeep(false);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const toggleTimer = () => {
    const next = !isTimerRunning;
    setIsTimerRunning(next);
    if (next) soundEffects.playWhistle(0.2);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ULTRA INTUITIVE: One-tap to score for a specific player!
  const handleScoreForPlayer = (player: PlayerInMatch, pts: number) => {
    soundEffects.playBounce();

    // 1. Add points to player
    setRosterStats(prev => prev.map(p => {
      if (p.playerId === player.playerId) {
        return { ...p, points: p.points + pts };
      }
      return p;
    }));

    // 2. Add points to team score
    setHomeScore(prev => prev + pts);

    // 3. Add to live log
    const typeLabel = pts === 1 ? 'Tiro Libre (+1)' : pts === 2 ? 'Canasta Doble (+2)' : '¡TRIPLE (+3)!';
    const logItem: ActionLogItem = {
      id: `log_${Date.now()}`,
      time: formatTimer(secondsLeft),
      text: `${typeLabel} anotado por ${player.name} (#${player.dorsal})`,
      playerId: player.playerId,
      pointsAdded: pts,
      team: 'home'
    };
    setActionLog(prev => [logItem, ...prev.slice(0, 14)]);
  };

  // Add foul to a specific player
  const handleFoulForPlayer = (player: PlayerInMatch) => {
    soundEffects.playWhistle(0.25);

    const nextFouls = player.fouls + 1;
    setRosterStats(prev => prev.map(p => {
      if (p.playerId === player.playerId) {
        return { ...p, fouls: nextFouls };
      }
      return p;
    }));

    const logItem: ActionLogItem = {
      id: `log_${Date.now()}`,
      time: formatTimer(secondsLeft),
      text: `Falta personal (${nextFouls}/5) cometida por ${player.name} (#${player.dorsal})`,
      playerId: player.playerId,
      isFoul: true,
      team: 'home'
    };
    setActionLog(prev => [logItem, ...prev.slice(0, 14)]);

    if (nextFouls >= 5) {
      soundEffects.playBuzzer(0.8);
    }
  };

  // Away team score
  const handleScoreForAway = (pts: number) => {
    soundEffects.playBounce();
    setAwayScore(prev => prev + pts);

    const logItem: ActionLogItem = {
      id: `log_${Date.now()}`,
      time: formatTimer(secondsLeft),
      text: `+${pts} pts para ${awayTeam}`,
      pointsAdded: pts,
      team: 'away'
    };
    setActionLog(prev => [logItem, ...prev.slice(0, 14)]);
  };

  // Instant Undo function if user mis-tapped
  const handleUndoLastAction = () => {
    if (actionLog.length === 0) return;
    const last = actionLog[0];
    soundEffects.playBounce();

    if (last.team === 'home') {
      if (last.pointsAdded) {
        setHomeScore(prev => Math.max(0, prev - last.pointsAdded!));
        if (last.playerId) {
          setRosterStats(prev => prev.map(p => {
            if (p.playerId === last.playerId) {
              return { ...p, points: Math.max(0, p.points - last.pointsAdded!) };
            }
            return p;
          }));
        }
      } else if (last.isFoul && last.playerId) {
        setRosterStats(prev => prev.map(p => {
          if (p.playerId === last.playerId) {
            return { ...p, fouls: Math.max(0, p.fouls - 1) };
          }
          return p;
        }));
      }
    } else {
      if (last.pointsAdded) {
        setAwayScore(prev => Math.max(0, prev - last.pointsAdded!));
      }
    }

    // Remove from log
    setActionLog(prev => prev.slice(1));
  };

  const handleFinishMatch = () => {
    soundEffects.playBuzzer(1.4);
    const finished: BasketballMatch = {
      id: `m_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      homeQuarterScores: [18, 16, 19, homeScore - 53],
      awayQuarterScores: [16, 17, 18, awayScore - 51],
      currentQuarter: 5,
      quarterSecondsLeft: 0,
      isMatchFinished: true,
      isPaused: false,
      location,
      survivorsPlayers: rosterStats
    };

    onSaveFinishedMatch(finished);
    alert(`¡Partido Finalizado y Guardado con Éxito!\n${homeTeam}: ${homeScore} vs ${awayTeam}: ${awayScore}`);
    onBackToHome();
  };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto pb-6">
      
      {/* 1. MARCADOR PRINCIPAL ULTRA-CLARO */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-blue-600">
        
        {/* Header Cuarto & Reloj */}
        <div className="flex items-center justify-between border-b border-blue-500/60 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase">
              {quarter}º CUARTO
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map(q => (
                <button
                  key={q}
                  onClick={() => setQuarter(q)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    quarter === q ? 'bg-white text-blue-900 font-black' : 'text-blue-200 hover:bg-blue-600'
                  }`}
                >
                  Q{q}
                </button>
              ))}
            </div>
          </div>

          {/* Reloj con un toque */}
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-black transition-all ${
              isTimerRunning ? 'bg-emerald-500 text-white shadow' : 'bg-white/20 text-blue-100 hover:bg-white/30'
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-300" />}
            <span>{formatTimer(secondsLeft)}</span>
          </button>
        </div>

        {/* Marcador Enorme de Ambos Equipos */}
        <div className="grid grid-cols-2 gap-4 items-center">
          
          {/* LOCAL: SURVIVORS */}
          <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/15">
            <input
              type="text"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full text-center bg-transparent font-black text-xs sm:text-sm text-amber-300 focus:outline-none uppercase truncate"
            />
            <div className="text-5xl sm:text-7xl font-mono font-black text-white my-1 tabular-nums">
              {homeScore}
            </div>
            <span className="text-[11px] text-blue-200 font-semibold block">
              Toca abajo a quien anotó ↓
            </span>
          </div>

          {/* VISITANTE: RIVAL */}
          <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/15">
            <input
              type="text"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full text-center bg-transparent font-black text-xs sm:text-sm text-blue-200 focus:outline-none uppercase truncate"
            />
            <div className="text-5xl sm:text-7xl font-mono font-black text-white my-1 tabular-nums">
              {awayScore}
            </div>
            
            {/* Botones directos para el rival */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <button
                onClick={() => handleScoreForAway(1)}
                className="flex-1 py-1 px-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold"
              >
                +1
              </button>
              <button
                onClick={() => handleScoreForAway(2)}
                className="flex-1 py-1 px-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold"
              >
                +2
              </button>
              <button
                onClick={() => handleScoreForAway(3)}
                className="flex-1 py-1 px-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold"
              >
                +3
              </button>
            </div>
          </div>
        </div>

        {/* Botones Rápidos de Cancha (Silbato, Deshacer y Finalizar) */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-blue-500/40 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => soundEffects.playDoubleWhistle()}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black rounded-xl hover:bg-amber-300 transition-all flex items-center gap-1 text-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Silbato</span>
            </button>

            {actionLog.length > 0 && (
              <button
                onClick={handleUndoLastAction}
                className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl transition-all flex items-center gap-1 text-xs"
                title="Deshacer última jugada anotada"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Deshacer error</span>
              </button>
            )}
          </div>

          <button
            onClick={handleFinishMatch}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-xs transition-all shadow"
          >
            Terminar Juego
          </button>
        </div>
      </div>

      {/* 2. REGISTRO FÁCIL: ¿QUIÉN ANOTÓ? (JUGADORES EN CANCHA) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-blue-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>🏀 ¿Quién anotó de {homeTeam}?</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Toca directamente +1, +2 o +3 en el jugador. Se suma al jugador y al marcador al instante.
            </p>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            5 en Cancha
          </span>
        </div>

        {/* Lista de Jugadores con Botones Táctiles Grandes */}
        <div className="space-y-2.5">
          {rosterStats.map((p) => {
            const isOut = p.fouls >= 5;
            const isDanger = p.fouls === 4;

            return (
              <div
                key={p.playerId}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isOut
                    ? 'bg-rose-50 border-rose-300 opacity-75'
                    : isDanger
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-400 shadow-sm'
                }`}
              >
                {/* Info Jugador */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow">
                    #{p.dorsal}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-slate-900 leading-tight">
                        {p.name}
                      </strong>
                      {isOut && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white">
                          5 FALTAS (FUERA)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                      <span className="text-blue-700 font-extrabold">{p.points} PTS anotados</span>
                      <span>·</span>
                      <span className="text-slate-400">{p.position}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Anotación de 1 Toque */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleScoreForPlayer(p, 1)}
                    className="min-h-[42px] px-3 rounded-xl bg-white hover:bg-blue-50 text-slate-800 text-xs font-black border border-slate-200 shadow-sm active:scale-95 transition-all"
                  >
                    +1 TL
                  </button>

                  <button
                    onClick={() => handleScoreForPlayer(p, 2)}
                    className="min-h-[42px] px-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black border border-blue-200 shadow-sm active:scale-95 transition-all"
                  >
                    +2 Doble
                  </button>

                  <button
                    onClick={() => handleScoreForPlayer(p, 3)}
                    className="min-h-[42px] px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    +3 Triple
                  </button>

                  {/* Botón de Falta */}
                  <button
                    onClick={() => handleFoulForPlayer(p)}
                    disabled={isOut}
                    className={`min-h-[42px] px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isOut
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : isDanger
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                    title="Registrar falta"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{p.fouls}/5</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TIRA EN VIVO DE LO QUE ACABA DE PASAR (FEED RECIENTE) */}
      <div className="bg-white rounded-3xl p-4 border border-blue-100 shadow-sm space-y-2">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider block">
          Registro Reciente en Vivo:
        </span>
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {actionLog.map((log) => (
            <div
              key={log.id}
              className={`text-xs p-2 rounded-xl flex items-center justify-between border ${
                log.team === 'home'
                  ? 'bg-blue-50/60 border-blue-200 text-blue-950 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 font-bold">{log.time}</span>
                <span>{log.text}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                log.team === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {log.team === 'home' ? homeTeam.split(' ')[0] : 'Rival'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
