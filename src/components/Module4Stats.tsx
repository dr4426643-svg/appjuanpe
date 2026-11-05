import React, { useState } from 'react';
import { BasketballMatch } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  Trophy, 
  TrendingUp, 
  Flame, 
  ShieldAlert, 
  Award, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface Module4StatsProps {
  matches: BasketballMatch[];
  onBackToHome: () => void;
}

export const Module4Stats: React.FC<Module4StatsProps> = ({
  matches,
  onBackToHome
}) => {
  const [selectedMatch, setSelectedMatch] = useState<BasketballMatch | null>(matches[0] || null);

  // Compute overall team metrics
  const totalPlayed = matches.length;
  const wonMatches = matches.filter(m => m.homeScore > m.awayScore).length;
  const lostMatches = totalPlayed - wonMatches;
  const winRate = totalPlayed > 0 ? Math.round((wonMatches / totalPlayed) * 100) : 0;

  const totalPointsFor = matches.reduce((acc, m) => acc + m.homeScore, 0);
  const avgPointsFor = totalPlayed > 0 ? (totalPointsFor / totalPlayed).toFixed(1) : '0';

  // Sorted players for selected match
  // 1. By Points (Highest to Lowest)
  const playersByPoints = selectedMatch
    ? [...selectedMatch.survivorsPlayers].sort((a, b) => b.points - a.points)
    : [];

  // 2. By Fouls (Highest to Lowest)
  const playersByFouls = selectedMatch
    ? [...selectedMatch.survivorsPlayers].sort((a, b) => b.fouls - a.fouls)
    : [];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center gap-2 self-start border border-blue-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Menú Principal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
            MÓDULO 4
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-bold text-slate-800">
            Estadísticas y Rankings de Partido
          </span>
        </div>
      </div>

      {/* Promedio General Superior (Partidos Ganados / Perdidos / Win Rate) */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Balance y Rendimiento General del Equipo</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Historial de resultados oficiales y promedios de anotación
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {winRate >= 50 ? 'Récord Ganador' : 'En Construcción'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Partidos Jugados</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {totalPlayed}
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase">Ganados</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {wonMatches}
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-rose-700 uppercase">Perdidos</span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
              {lostMatches}
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-blue-700 uppercase">% Victoria</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {winRate}%
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-amber-800 uppercase">Promedio PTS</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {avgPointsFor}
              <span className="text-xs text-slate-500 font-normal ml-1">/partido</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Match List + Selected Match Deep Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Match History List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Historial de Partidos ({matches.length})</span>
          </h3>

          <div className="space-y-3">
            {matches.map((m) => {
              const isWin = m.homeScore > m.awayScore;
              const isSelected = selectedMatch?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMatch(m);
                    soundEffects.playBounce();
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-blue-100 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-medium">{m.date} · {m.time}</span>
                    <span className={`font-black px-2.5 py-0.5 rounded-full text-[10px] ${
                      isWin 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {isWin ? 'VICTORIA' : 'DERROTA'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm sm:text-base font-black text-slate-900 truncate max-w-[170px]">
                      {m.homeTeam}
                    </span>
                    <span className="font-mono font-black text-lg text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-100">
                      {m.homeScore} - {m.awayScore}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 truncate max-w-[110px] text-right">
                      {m.awayTeam}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="truncate">{m.location}</span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Selected Game Ranking (Points & Fouls De Mayor a Menor) */}
        <div className="lg:col-span-7">
          {selectedMatch ? (
            <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              
              {/* Selected Match Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{selectedMatch.date} · {selectedMatch.location}</span>
                  <span className={`font-black text-xs ${
                    selectedMatch.homeScore > selectedMatch.awayScore ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {selectedMatch.homeScore > selectedMatch.awayScore ? '🏆 VICTORIA SURVIVORS' : 'DERROTA'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                  </h3>
                  <div className="font-mono font-black text-2xl sm:text-3xl text-blue-700">
                    {selectedMatch.homeScore} : {selectedMatch.awayScore}
                  </div>
                </div>

                {/* Cuartos breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3 pt-3 border-t border-slate-100">
                  {selectedMatch.homeQuarterScores.map((score, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 block font-bold">Q{idx + 1}</span>
                      <span className="font-mono font-black text-slate-900">
                        {score} - {selectedMatch.awayQuarterScores[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1. Ranking de Anotadores (De Mayor a Menor) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Líderes de Anotación (De Mayor a Menor)</span>
                  </h4>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    MVP: {playersByPoints[0]?.name}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {playersByPoints.map((player, rank) => (
                    <div
                      key={player.playerId}
                      className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                        rank === 0
                          ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                          rank === 0 
                            ? 'bg-amber-400 text-slate-950 shadow-sm' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rank + 1}
                        </span>

                        <div>
                          <strong className="text-sm font-black text-slate-900 block leading-tight">
                            {player.name}
                          </strong>
                          <span className="text-xs text-slate-500 font-medium">
                            #{player.dorsal} · {player.position}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black font-mono text-blue-700">
                          {player.points} PTS
                        </span>
                        <div className="text-xs text-slate-400 font-medium">
                          {player.rebounds} reb · {player.assists} asist
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Ranking de Faltas Cometidas (De Mayor a Menor) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Faltas Cometidas (Control Disciplinario de Mayor a Menor)</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {playersByFouls.map((player) => (
                    <div
                      key={player.playerId}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400 font-bold">#{player.dorsal}</span>
                        <span className="font-bold text-slate-800">{player.name}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((f) => (
                            <span
                              key={f}
                              className={`w-2 h-2 rounded-full ${
                                f <= player.fouls 
                                  ? player.fouls >= 5 ? 'bg-rose-600' : 'bg-amber-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-rose-600 text-xs w-14 text-right">
                          {player.fouls} faltas
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-blue-100 text-slate-400">
              Selecciona un partido del historial para ver el ranking detallado de anotadores y faltas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
