import React from 'react';
import { ClubSettings, DailyWorkout, PlayerRecord, BasketballMatch } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  Trophy, 
  Clock, 
  Sparkles, 
  Users, 
  Eye,
  Calendar,
  Settings
} from 'lucide-react';

interface HomeHubProps {
  settings: ClubSettings;
  workouts: DailyWorkout[];
  players: PlayerRecord[];
  matches: BasketballMatch[];
  onSelectModule: (moduleId: 1 | 2 | 3 | 4) => void;
  onOpenCourt3D: () => void;
  onOpenSettings: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  settings,
  workouts,
  players,
  matches,
  onSelectModule,
  onOpenCourt3D,
  onOpenSettings
}) => {
  // Quick stats
  const activePlayers = players.filter(p => p.status === 'Activo').length;
  const wonCount = matches.filter(m => m.homeScore > m.awayScore).length;
  const winRate = matches.length > 0 ? Math.round((wonCount / matches.length) * 100) : 0;

  return (
    <div className="space-y-5 w-full max-w-4xl mx-auto">
      
      {/* Real NBA Arena Hero Banner with Welcome Message */}
      <div className="relative rounded-3xl overflow-hidden border border-blue-200/80 shadow-md bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-5 sm:p-7">
        
        {/* Background Real NBA Arena Photography */}
        <img
          src="/src/assets/images/nba_arena_background_1793845091433.jpg"
          alt="Estadio NBA Baloncesto"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.15]"
        />

        {/* Degraded Blue Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/40 to-transparent" />

        {/* Top Header on Banner - Clean (No floating eye button) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md shrink-0 p-0.5">
              <img
                src={settings.logoUrl}
                alt={settings.teamName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase drop-shadow block">
                SURVIVORS MELLADO B.C.
              </span>
              <h2 className="text-xs sm:text-sm font-black text-white tracking-wide leading-none drop-shadow">
                {settings.teamName}
              </h2>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-black/40 text-blue-200 border border-white/20 text-[11px] font-bold backdrop-blur-md">
            {settings.city}
          </div>
        </div>

        {/* Hero Welcome Message */}
        <div className="relative z-10 space-y-2 mt-12 sm:mt-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/30 text-white text-[11px] font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CENTRO DE ALTO RENDIMIENTO</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            Preparación Física y Control Táctico
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium drop-shadow max-w-xl">
            {settings.tagline} · Selecciona cualquier módulo en la barra inferior de tu teléfono para acceder a tus entrenamientos, plantel, marcador en vivo o historial.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>{activePlayers} Jugadores Activos</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{wonCount} Victorias ({winRate}%)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>Lunes a Viernes</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Cancha Táctica Completa en 3D (Simulación de Movimientos) */}
      <div 
        onClick={() => {
          soundEffects.playBounce();
          onOpenCourt3D();
        }}
        className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white border border-blue-700/80 rounded-3xl p-5 sm:p-6 shadow-md flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all group"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded uppercase">
              VISTA 3D INTERACTIVA
            </span>
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
              Cancha Oficial Completa en 3D
            </h3>
          </div>
          <p className="text-xs text-blue-200 max-w-lg leading-relaxed">
            Mira la secuencia de los ejercicios en movimiento con los atletas 3D, conos y balón en la duela completa con ambos aros de Survivors Mellado.
          </p>
          <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold pt-1">
            <span>🏀 Líneas Suicidas</span>
            <span>·</span>
            <span>🛡️ Zig-zag Defensivo</span>
            <span>·</span>
            <span>⚡ Salto al Aro</span>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-md ml-3">
          <Eye className="w-6 h-6 text-amber-300 group-hover:text-white" />
        </div>
      </div>

      {/* Información del Club y Cuerpo Técnico */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-5 rounded-full bg-blue-600 inline-block" />
            <h3 className="text-base font-black text-slate-900">
              Cuerpo Técnico & Organización
            </h3>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Editar Datos del Club
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block font-medium">Entrenador en Jefe:</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{settings.coachName}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block font-medium">Sede Principal:</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{settings.city} · Gimnasio Municipal</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block font-medium">Régimen Semanal:</span>
            <span className="font-bold text-blue-700 text-sm mt-0.5 block">5 Días de Carga (Sáb/Dom Libres)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
