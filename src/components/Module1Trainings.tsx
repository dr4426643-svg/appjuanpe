import React, { useState, useEffect } from 'react';
import { DailyWorkout, DayOfWeek } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Star, 
  AlertTriangle,
  Clock, 
  Eye,
  Info,
  ArrowLeft,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface Module1TrainingsProps {
  workouts: DailyWorkout[];
  onUpdateWorkout: (updated: DailyWorkout) => void;
  onOpenCourt3D: () => void;
  onBackToHome: () => void;
}

export const Module1Trainings: React.FC<Module1TrainingsProps> = ({
  workouts,
  onUpdateWorkout,
  onOpenCourt3D,
  onBackToHome
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'fin_semana'>('lunes');
  const currentWorkout = workouts.find(w => w.day === selectedDay) || workouts[0];

  // Stretch Timer State
  const [stretchSecondsLeft, setStretchSecondsLeft] = useState<number>(currentWorkout.stretchTotalMin * 60);
  const [isStretchActive, setIsStretchActive] = useState<boolean>(false);

  // Jog Timer State
  const [jogSecondsLeft, setJogSecondsLeft] = useState<number>(currentWorkout.jogTotalMin * 60);
  const [isJogActive, setIsJogActive] = useState<boolean>(false);

  // Coach rating form state
  const [tempRating, setTempRating] = useState<number>(currentWorkout.coachRating || 4);
  const [tempFeedback, setTempFeedback] = useState<string>(currentWorkout.coachFeedback || '');
  const [ratingSavedToast, setRatingSavedToast] = useState<boolean>(false);

  // Synchronize timers when day changes
  useEffect(() => {
    if (selectedDay !== 'fin_semana') {
      const w = workouts.find(item => item.day === selectedDay);
      if (w) {
        setStretchSecondsLeft(w.stretchTotalMin * 60);
        setJogSecondsLeft(w.jogTotalMin * 60);
        setIsStretchActive(false);
        setIsJogActive(false);
        setTempRating(w.coachRating || 4);
        setTempFeedback(w.coachFeedback || '');
      }
    }
  }, [selectedDay, workouts]);

  // Stretch countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStretchActive && stretchSecondsLeft > 0) {
      interval = setInterval(() => {
        setStretchSecondsLeft(prev => {
          if (prev <= 1) {
            setIsStretchActive(false);
            soundEffects.playDoubleWhistle();
            return 0;
          }
          if (prev <= 4 && prev > 1) soundEffects.playBeep(false);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStretchActive, stretchSecondsLeft]);

  // Jog countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isJogActive && jogSecondsLeft > 0) {
      interval = setInterval(() => {
        setJogSecondsLeft(prev => {
          if (prev <= 1) {
            setIsJogActive(false);
            soundEffects.playBuzzer(1.2);
            return 0;
          }
          if (prev <= 4 && prev > 1) soundEffects.playBeep(false);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isJogActive, jogSecondsLeft]);

  const handleSaveCoachEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playWhistle(0.3);

    const isLow = tempRating <= 3;
    const updated: DailyWorkout = {
      ...currentWorkout,
      coachRating: tempRating,
      coachFeedback: tempFeedback,
      isExtendedForTomorrow: isLow,
      adaptedTomorrowFocus: isLow 
        ? `⚠️ Prórroga Automática: El entrenador calificó con ${tempRating} estrellas. Se reprograman 15 minutos extras de refuerzo táctico para mañana.`
        : undefined
    };

    onUpdateWorkout(updated);
    setRatingSavedToast(true);
    setTimeout(() => setRatingSavedToast(false), 3500);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            MÓDULO 1
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-bold text-slate-800">
            Entrenamientos Semanales (Lunes a Viernes)
          </span>
        </div>
      </div>

      {/* Day Selector Buttons: Fluid responsive bar */}
      <div className="bg-white p-2 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'lunes', label: 'Lunes' },
          { key: 'martes', label: 'Martes' },
          { key: 'miercoles', label: 'Miércoles' },
          { key: 'jueves', label: 'Jueves' },
          { key: 'viernes', label: 'Viernes' },
          { key: 'fin_semana', label: 'Sáb & Dom (Libres)' }
        ].map((dayItem) => (
          <button
            key={dayItem.key}
            onClick={() => {
              setSelectedDay(dayItem.key as DayOfWeek | 'fin_semana');
              soundEffects.playBounce();
            }}
            className={`flex-1 min-h-[46px] px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedDay === dayItem.key
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {dayItem.label}
          </button>
        ))}
      </div>

      {/* Weekend Rest View */}
      {selectedDay === 'fin_semana' ? (
        <div className="bg-white border border-blue-100 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-3xl shadow-sm border border-blue-200">
            🏀
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Sábado y Domingo: Días Libres y Recuperación
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Tal como está programado para el equipo Survivors de Mellado, el fin de semana se destina a la recuperación muscular activa, hidratación, repaso de pizarras y descanso de ligamentos tras la carga de Lunes a Viernes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSelectedDay('lunes')}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20"
            >
              Ver Entrenamiento del Lunes
            </button>
          </div>
        </div>
      ) : (
        /* Active Day Training Content */
        <div className="space-y-6">
          
          {/* Main Focus Card: White with Royal Blue Gradient Accent */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-2 border border-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                SESIÓN OFICIAL SURVIVORS
              </span>
              <button
                onClick={onOpenCourt3D}
                className="px-3.5 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Ver Cancha 3D</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {currentWorkout.dayTitle}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-semibold">
              {currentWorkout.focusTitle}
            </p>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed pt-1 max-w-3xl">
              {currentWorkout.description}
            </p>
          </div>

          {/* Cronómetros Obligatorios Previos: Estiramiento y Trote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. Cronómetro de Estiramiento */}
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-base border border-blue-200">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Estiramiento Corporal
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Prevención de lesiones ({currentWorkout.stretchTotalMin} min obligatorios)
                    </span>
                  </div>
                </div>

                <span className="font-mono font-black text-2xl text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                  {formatTimer(stretchSecondsLeft)}
                </span>
              </div>

              {/* Stretch Timer Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isStretchActive;
                    setIsStretchActive(next);
                    if (next) soundEffects.playWhistle(0.2);
                  }}
                  className={`flex-1 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isStretchActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  {isStretchActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isStretchActive ? 'Pausar Estiramiento' : 'Iniciar Cronómetro'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsStretchActive(false);
                    setStretchSecondsLeft(currentWorkout.stretchTotalMin * 60);
                  }}
                  className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  title="Reiniciar cronómetro"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Desglose de ejercicios de estiramiento explicados */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Ejercicios de estiramiento incluidos:
                </span>
                <div className="space-y-2">
                  {currentWorkout.stretches.map((st, i) => (
                    <div key={st.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{i + 1}. {st.name}</span>
                        <span className="text-blue-600 font-mono text-[11px]">{st.durationSec}s</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {st.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Cronómetro de Trote y Activación */}
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base border border-indigo-200">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Trote & Cardio Previo
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Activación aeróbica ({currentWorkout.jogTotalMin} min obligatorios)
                    </span>
                  </div>
                </div>

                <span className="font-mono font-black text-2xl text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                  {formatTimer(jogSecondsLeft)}
                </span>
              </div>

              {/* Jog Timer Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isJogActive;
                    setIsJogActive(next);
                    if (next) soundEffects.playWhistle(0.2);
                  }}
                  className={`flex-1 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isJogActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {isJogActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isJogActive ? 'Pausar Trote' : 'Iniciar Cronómetro'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsJogActive(false);
                    setJogSecondsLeft(currentWorkout.jogTotalMin * 60);
                  }}
                  className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  title="Reiniciar trote"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Fases de Trote explicadas */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Pautas de intensidad de trote:
                </span>
                <div className="space-y-2">
                  {currentWorkout.jogPhases.map((jg, i) => (
                    <div key={jg.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{i + 1}. {jg.name}</span>
                        <span className="text-indigo-600 font-semibold text-[11px]">{jg.targetHeartRate}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {jg.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ejercicios Principales Explicados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-5 rounded-full bg-blue-600 inline-block" />
                  <span>Ejercicios Específicos del Día ({currentWorkout.exercises.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explicación paso a paso para que todos los jugadores sepan qué entrenamiento realizar
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentWorkout.exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm shrink-0 border border-blue-200">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900">
                          {ex.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-bold text-blue-600">{ex.setsReps}</span>
                          <span>·</span>
                          <span className="capitalize font-medium">{ex.category}</span>
                        </div>
                      </div>
                    </div>

                    {ex.drill3dId && (
                      <button
                        onClick={onOpenCourt3D}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver en Cancha 3D</span>
                      </button>
                    )}
                  </div>

                  {/* Explicación Detallada */}
                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm">
                    <div>
                      <strong className="text-slate-800 block mb-0.5 font-bold">
                        🎯 Objetivo Táctico:
                      </strong>
                      <p className="text-slate-600">
                        {ex.tacticalObjective}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-800 block mb-0.5 font-bold">
                        📋 Explicación del Movimiento:
                      </strong>
                      <p className="text-slate-600 leading-relaxed">
                        {ex.detailedExplanation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-blue-700 font-semibold pt-1">
                      <Info className="w-4 h-4 shrink-0 text-blue-600" />
                      <span>Tip del Entrenador: {ex.courtTip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Calificación del Entrenador & Prórroga Automática */}
          <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Calificación del Rendimiento por el Entrenador</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evalúa la intensidad del equipo hoy. Si el rendimiento es igual o menor a 3 estrellas, la app prorroga y adapta la carga para el día siguiente automáticamente.
                </p>
              </div>

              {currentWorkout.isExtendedForTomorrow && (
                <span className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Prórroga Activada</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveCoachEvaluation} className="space-y-4">
              {/* Star selector */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Nivel de Intensidad y Cumplimiento del Entrenamiento:
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setTempRating(star)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        tempRating >= star
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${tempRating >= star ? 'fill-slate-950' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {tempRating === 5 && '5/5 · Intensidad Élite'}
                    {tempRating === 4 && '4/5 · Muy Buen Ritmo'}
                    {tempRating === 3 && '3/5 · Regular (Prórroga Recomendada)'}
                    {tempRating === 2 && '2/5 · Bajo Rendimiento (Repetir mañana)'}
                    {tempRating === 1 && '1/5 · Deficiente (Revisar fatiga)'}
                  </span>
                </div>
              </div>

              {/* Feedback text */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Observaciones Técnicas del Coach:
                </label>
                <textarea
                  rows={2}
                  value={tempFeedback}
                  onChange={(e) => setTempFeedback(e.target.value)}
                  placeholder="Ej. Buena respuesta en los suicidios, pero hay que apretar la velocidad de despegue..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {currentWorkout.adaptedTomorrowFocus && (
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
                  {currentWorkout.adaptedTomorrowFocus}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-600 font-bold">
                  {ratingSavedToast ? '✅ ¡Calificación y prórroga actualizadas correctamente!' : ''}
                </span>

                <button
                  type="submit"
                  className="px-6 min-h-[46px] bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  Guardar Calificación del Día
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
