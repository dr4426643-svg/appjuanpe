import React, { useState } from 'react';
import { ClubSettings, DailyWorkout, PlayerRecord, BasketballMatch } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { exportPhpMysqlZip } from '../utils/phpExporter';
import { X, Save, Image, Shield, Sparkles, Download, Database, CheckCircle2 } from 'lucide-react';

interface ClubSettingsModalProps {
  settings: ClubSettings;
  workouts: DailyWorkout[];
  players: PlayerRecord[];
  matches: BasketballMatch[];
  onSaveSettings: (settings: ClubSettings) => void;
  onClose: () => void;
}

export const ClubSettingsModal: React.FC<ClubSettingsModalProps> = ({
  settings,
  workouts,
  players,
  matches,
  onSaveSettings,
  onClose
}) => {
  const [teamName, setTeamName] = useState<string>(settings.teamName);
  const [city, setCity] = useState<string>(settings.city);
  const [tagline, setTagline] = useState<string>(settings.tagline);
  const [coachName, setCoachName] = useState<string>(settings.coachName);
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<boolean>(false);

  const handleDownloadPhpZip = async () => {
    try {
      setIsExporting(true);
      soundEffects.playWhistle(0.3);
      await exportPhpMysqlZip(settings, workouts, players, matches);
      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 5000);
    } catch (err) {
      console.error('Error generating zip:', err);
      alert('Hubo un error al generar el archivo .zip');
    } finally {
      setIsExporting(false);
    }
  };

  const PRESET_LOGOS = [
    {
      name: 'Escudo Oficial Survivors',
      url: '/src/assets/images/survivors_team_crest_1793843097650.jpg'
    },
    {
      name: 'Baloncesto Dorado Élite',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop&q=80'
    },
    {
      name: 'Championship Trophy',
      url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    soundEffects.playDoubleWhistle();
    onSaveSettings({
      ...settings,
      teamName: teamName.trim(),
      city: city.trim(),
      tagline: tagline.trim(),
      coachName: coachName.trim(),
      logoUrl: logoUrl.trim() || settings.logoUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md shadow-2xl space-y-4 my-auto box-border overflow-x-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-base shadow-sm border border-blue-200 shrink-0">
              ⚙️
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                Ajustes del Equipo
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Personaliza escudo, nombre y descarga SQL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 shrink-0 ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 w-full min-w-0">
          {/* Logo Preview and Selector */}
          <div className="w-full min-w-0">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Logo / Escudo del Equipo:
            </label>
            
            <div className="flex items-center gap-2.5 mb-2 w-full min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-blue-600 bg-white shrink-0 shadow-md p-0.5">
                <img
                  src={logoUrl}
                  alt="Escudo"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/survivors_team_crest_1793843097650.jpg';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 cursor-pointer transition-colors shadow-sm truncate">
                  <Image className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Subir Logo desde Galería</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setLogoUrl(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Presets fitting perfectly in 3 columns without overflow */}
            <div className="grid grid-cols-3 gap-1.5 mb-2 w-full min-w-0">
              {PRESET_LOGOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setLogoUrl(p.url)}
                  className={`text-[10px] py-1.5 px-1 rounded-lg border font-bold transition-all text-center truncate ${
                    logoUrl === p.url
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={p.name}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="URL de imagen personalizada (https://...)"
              className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 box-border truncate"
            />
          </div>

          {/* Team Name */}
          <div className="w-full min-w-0">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nombre Oficial del Equipo *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej. Survivors de Mellado"
              className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-bold box-border"
            />
          </div>

          {/* Sede y Entrenador: 1 column on mobile to never exceed margins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full min-w-0">
            <div className="w-full min-w-0">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ciudad / Sede
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej. Mellado"
                className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 box-border"
              />
            </div>

            <div className="w-full min-w-0">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Entrenador / Coach
              </label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Ej. Prof. Carlos Mellado"
                className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 box-border"
              />
            </div>
          </div>

          <div className="w-full min-w-0">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Lema / Slogan del Club
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ej. Fuerza, Disciplina y Victoria en Cancha"
              className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 box-border"
            />
          </div>

          {/* SECCIÓN EXCLUSIVA: Descarga de Base de Datos MySQL y Código PHP */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-2 w-full min-w-0 box-border overflow-hidden">
            <div className="flex items-center gap-2 w-full min-w-0">
              <Database className="w-4 h-4 text-blue-700 shrink-0" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                Base de Datos MySQL y Código PHP (.ZIP)
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Exporta archivos PHP, tablas SQL (<code className="text-blue-700 bg-white px-1 py-0.5 rounded border border-blue-200 font-mono text-[10px]">database.sql</code>) y jugadores listos para localhost (XAMPP / WAMP).
            </p>
            <button
              type="button"
              onClick={handleDownloadPhpZip}
              disabled={isExporting}
              className="w-full min-h-[42px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">{isExporting ? 'Generando archivo .ZIP...' : 'Descargar Proyecto PHP + SQL (.ZIP)'}</span>
            </button>
            {downloadSuccessToast && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] truncate">¡Descargado! Survivors_Mellado_PHP_MySQL.zip listo.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 w-full min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0"
            >
              Guardar Ajustes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
