import React, { useState } from 'react';
import { PlayerRecord } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  UserPlus, 
  Check, 
  Clock, 
  X, 
  Search, 
  ArrowLeft,
  Users,
  Shield,
  Trash2,
  Edit2,
  Camera
} from 'lucide-react';

interface Module2AttendanceProps {
  players: PlayerRecord[];
  onUpdatePlayers: (players: PlayerRecord[]) => void;
  onBackToHome: () => void;
}

export const Module2Attendance: React.FC<Module2AttendanceProps> = ({
  players,
  onUpdatePlayers,
  onBackToHome
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerRecord | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formIdCard, setFormIdCard] = useState<string>('');
  const [formAge, setFormAge] = useState<number>(20);
  const [formBirthDate, setFormBirthDate] = useState<string>('2004-01-15');
  const [formJoinDate, setFormJoinDate] = useState<string>('2023-01-10');
  const [formLeaveDate, setFormLeaveDate] = useState<string>('Activo');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formDorsal, setFormDorsal] = useState<number>(10);
  const [formPosition, setFormPosition] = useState<PlayerRecord['position']>('Base');
  const [formHeight, setFormHeight] = useState<number>(185);
  const [formWeight, setFormWeight] = useState<number>(80);
  const [formStatus, setFormStatus] = useState<PlayerRecord['status']>('Activo');

  const filteredPlayers = players.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.idCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dorsal.toString().includes(searchTerm)
  );

  const presentCount = players.filter(p => p.todayAttendance === 'Presente').length;
  const lateCount = players.filter(p => p.todayAttendance === 'Retraso').length;
  const absentCount = players.filter(p => p.todayAttendance === 'Ausente').length;

  const setAttendance = (id: string, status: PlayerRecord['todayAttendance']) => {
    soundEffects.playBounce();
    const updated = players.map(p => {
      if (p.id === id) {
        const wasPresent = p.todayAttendance === 'Presente';
        const isNowPresent = status === 'Presente';
        return {
          ...p,
          todayAttendance: status,
          totalAttendances: isNowPresent && !wasPresent ? p.totalAttendances + 1 : p.totalAttendances,
          totalMissed: status === 'Ausente' && p.todayAttendance !== 'Ausente' ? p.totalMissed + 1 : p.totalMissed
        };
      }
      return p;
    });
    onUpdatePlayers(updated);
  };

  const handleOpenAdd = () => {
    setEditingPlayer(null);
    setFormName('');
    setFormIdCard('');
    setFormAge(21);
    setFormBirthDate('2005-05-10');
    setFormJoinDate(new Date().toISOString().split('T')[0]);
    setFormLeaveDate('Activo');
    setFormPhotoUrl('https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop&q=80');
    setFormDorsal(players.length > 0 ? Math.max(...players.map(p => p.dorsal)) + 1 : 1);
    setFormPosition('Base');
    setFormHeight(188);
    setFormWeight(82);
    setFormStatus('Activo');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: PlayerRecord) => {
    setEditingPlayer(p);
    setFormName(p.fullName);
    setFormIdCard(p.idCard);
    setFormAge(p.age);
    setFormBirthDate(p.birthDate);
    setFormJoinDate(p.joinDate);
    setFormLeaveDate(p.leaveDate);
    setFormPhotoUrl(p.photoUrl);
    setFormDorsal(p.dorsal);
    setFormPosition(p.position);
    setFormHeight(p.heightCm);
    setFormWeight(p.weightKg);
    setFormStatus(p.status);
    setShowAddModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formIdCard.trim()) return;

    soundEffects.playDoubleWhistle();

    if (editingPlayer) {
      // Edit existing
      const updated = players.map(p => {
        if (p.id === editingPlayer.id) {
          return {
            ...p,
            fullName: formName.trim(),
            idCard: formIdCard.trim(),
            age: formAge,
            birthDate: formBirthDate,
            joinDate: formJoinDate,
            leaveDate: formLeaveDate.trim() || 'Activo',
            photoUrl: formPhotoUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formName)}&background=2563eb&color=fff`,
            dorsal: formDorsal,
            position: formPosition,
            heightCm: formHeight,
            weightKg: formWeight,
            status: formStatus
          };
        }
        return p;
      });
      onUpdatePlayers(updated);
    } else {
      // Create new
      const newPlayer: PlayerRecord = {
        id: `p_${Date.now()}`,
        fullName: formName.trim(),
        idCard: formIdCard.trim(),
        age: formAge,
        birthDate: formBirthDate,
        joinDate: formJoinDate,
        leaveDate: formLeaveDate.trim() || 'Activo',
        photoUrl: formPhotoUrl.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(formName)}&background=2563eb&color=fff`,
        dorsal: formDorsal,
        position: formPosition,
        heightCm: formHeight,
        weightKg: formWeight,
        status: formStatus,
        todayAttendance: 'Presente',
        totalAttendances: 1,
        totalMissed: 0
      };
      onUpdatePlayers([...players, newPlayer]);
    }

    setShowAddModal(false);
  };

  const handleDeletePlayer = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar a este jugador del registro?')) {
      onUpdatePlayers(players.filter(p => p.id !== id));
      soundEffects.playBounce();
    }
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
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            MÓDULO 2
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-bold text-slate-800">
            Registro y Asistencia de Jugadores
          </span>
        </div>
      </div>

      {/* KPI Stats Strip in Bright White & Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-blue-100 p-4 sm:p-5 rounded-3xl shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plantel Total</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {players.length}
          </div>
        </div>
        <div className="bg-white border border-emerald-200 p-4 sm:p-5 rounded-3xl shadow-sm text-center">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Presentes Hoy</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {presentCount}
          </div>
        </div>
        <div className="bg-white border border-amber-200 p-4 sm:p-5 rounded-3xl shadow-sm text-center">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Con Retraso</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            {lateCount}
          </div>
        </div>
        <div className="bg-white border border-rose-200 p-4 sm:p-5 rounded-3xl shadow-sm text-center">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Ausentes</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
            {absentCount}
          </div>
        </div>
      </div>

      {/* Top Toolbar: Search and Add Player */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o dorsal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="min-h-[46px] px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Nuevo Jugador</span>
        </button>
      </div>

      {/* Players List with Full Identity & Daily Attendance */}
      <div className="space-y-3">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white border border-blue-100 hover:border-blue-300 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Profile Photo & Main Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-blue-600 bg-slate-50 shrink-0 shadow-md">
                    <img
                      src={player.photoUrl}
                      alt={player.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.fullName)}&background=2563eb&color=fff`;
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center border border-white shadow">
                    #{player.dorsal}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {player.fullName}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      player.status === 'Activo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : player.status === 'Lesionado'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {player.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-slate-800">
                      Cédula: {player.idCard}
                    </span>
                    <span>·</span>
                    <span>{player.age} años</span>
                    <span>·</span>
                    <span className="font-bold text-blue-700">{player.position}</span>
                    <span>·</span>
                    <span>{player.heightCm} cm / {player.weightKg} kg</span>
                  </div>
                </div>
              </div>

              {/* Attendance Quick Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs font-bold text-slate-400 mr-1 hidden lg:inline">Asistencia:</span>
                
                <button
                  onClick={() => setAttendance(player.id, 'Presente')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    player.todayAttendance === 'Presente'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Marcar Presente"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Presente</span>
                </button>

                <button
                  onClick={() => setAttendance(player.id, 'Retraso')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    player.todayAttendance === 'Retraso'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Marcar con Retraso"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Retraso</span>
                </button>

                <button
                  onClick={() => setAttendance(player.id, 'Ausente')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    player.todayAttendance === 'Ausente'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Marcar Ausente"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Ausente</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(player)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors ml-1"
                  title="Editar ficha del jugador"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dates & Attendance Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block font-medium">Nacimiento:</span>
                <span className="font-bold text-slate-800">{player.birthDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha Ingreso:</span>
                <span className="font-bold text-slate-800">{player.joinDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha Salida:</span>
                <span className="font-bold text-slate-800">{player.leaveDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Historial Asistencia:</span>
                <span className="font-bold text-emerald-700">
                  {player.totalAttendances} asistencias / {player.totalMissed} faltas
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Form para Registrar o Editar Jugador */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg shadow-2xl space-y-3.5 my-auto box-border overflow-x-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {editingPlayer ? 'Editar Ficha del Jugador' : 'Registrar Nuevo Jugador'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 shrink-0 ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3 w-full min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full min-w-0">
                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Carlos Mellado"
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cédula / DNI *
                  </label>
                  <input
                    type="text"
                    required
                    value={formIdCard}
                    onChange={(e) => setFormIdCard(e.target.value)}
                    placeholder="Ej. V-28.123.456"
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full min-w-0">
                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="50"
                    value={formAge}
                    onChange={(e) => setFormAge(parseInt(e.target.value, 10) || 18)}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Dorsal (#)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formDorsal}
                    onChange={(e) => setFormDorsal(parseInt(e.target.value, 10) || 0)}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Posición
                  </label>
                  <select
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value as PlayerRecord['position'])}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-1.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  >
                    <option>Base</option>
                    <option>Escolta</option>
                    <option>Alero</option>
                    <option>Ala-Pívot</option>
                    <option>Pívot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full min-w-0">
                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Fecha de Ingreso *
                  </label>
                  <input
                    type="date"
                    required
                    value={formJoinDate}
                    onChange={(e) => setFormJoinDate(e.target.value)}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full min-w-0">
                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Fecha de Salida
                  </label>
                  <input
                    type="text"
                    value={formLeaveDate}
                    onChange={(e) => setFormLeaveDate(e.target.value)}
                    placeholder="Activo o Fecha"
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  />
                </div>

                <div className="w-full min-w-0">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estado en el Plantel
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PlayerRecord['status'])}
                    className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border"
                  >
                    <option>Activo</option>
                    <option>Lesionado</option>
                    <option>Permiso</option>
                    <option>Egresado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Foto de Perfil del Jugador:
                </label>
                
                {/* Image Preview & Gallery Upload */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-600 bg-slate-100 shrink-0 shadow-sm">
                    {formPhotoUrl ? (
                      <img
                        src={formPhotoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Sin foto
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 cursor-pointer transition-colors shadow-sm truncate">
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Subir Foto de Galería</span>
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
                                setFormPhotoUrl(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-1 truncate">
                      O escribe la URL abajo:
                    </span>
                  </div>
                </div>

                <input
                  type="url"
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full min-w-0 max-w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 box-border truncate"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingPlayer ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePlayer(editingPlayer.id)}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Jugador</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20"
                  >
                    {editingPlayer ? 'Actualizar Ficha' : 'Guardar Jugador'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
