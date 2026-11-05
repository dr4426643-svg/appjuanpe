export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export interface ClubSettings {
  teamName: string;
  city: string;
  tagline: string;
  coachName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface StretchExercise {
  id: string;
  name: string;
  durationSec: number;
  muscleGroup: string;
  instructions: string;
}

export interface JogPhase {
  id: string;
  name: string;
  durationSec: number;
  targetHeartRate: string;
  instructions: string;
}

export interface DailyExerciseItem {
  id: string;
  name: string;
  category: 'explosividad' | 'resistencia' | 'agilidad' | 'tecnica' | 'fuerza';
  setsReps: string;
  tacticalObjective: string;
  detailedExplanation: string;
  courtTip: string;
  drill3dId?: string;
}

export interface DailyWorkout {
  day: DayOfWeek;
  dayTitle: string;
  focusTitle: string;
  stretchTotalMin: number;
  jogTotalMin: number;
  mainWorkoutMin: number;
  description: string;
  stretches: StretchExercise[];
  jogPhases: JogPhase[];
  exercises: DailyExerciseItem[];
  coachRating: number; // 1-5
  coachFeedback: string;
  isExtendedForTomorrow: boolean;
  adaptedTomorrowFocus?: string;
}

export interface PlayerRecord {
  id: string;
  fullName: string;
  idCard: string; // Cédula / DNI
  age: number;
  birthDate: string; // YYYY-MM-DD
  joinDate: string; // YYYY-MM-DD
  leaveDate: string; // "Activo" or date
  photoUrl: string;
  dorsal: number;
  position: 'Base' | 'Escolta' | 'Alero' | 'Ala-Pívot' | 'Pívot';
  heightCm: number;
  weightKg: number;
  status: 'Activo' | 'Lesionado' | 'Permiso' | 'Egresado';
  todayAttendance: 'Presente' | 'Retraso' | 'Justificado' | 'Ausente';
  attendanceNotes?: string;
  totalAttendances: number;
  totalMissed: number;
}

export interface PlayerInMatch {
  playerId: string;
  name: string;
  dorsal: number;
  position: string;
  points: number;
  fouls: number;
  rebounds: number;
  assists: number;
}

export interface BasketballMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeQuarterScores: [number, number, number, number];
  awayQuarterScores: [number, number, number, number];
  currentQuarter: number; // 1, 2, 3, 4 or 5 for final
  quarterSecondsLeft: number;
  isMatchFinished: boolean;
  isPaused: boolean;
  survivorsPlayers: PlayerInMatch[];
  location: string;
  notes?: string;
}

export interface TeamStatsSummary {
  played: number;
  won: number;
  lost: number;
  winRate: number;
  pointsForAverage: number;
  pointsAgainstAverage: number;
  streak: string;
}

export interface DrillPoint3D {
  x: number;
  y: number;
  z: number;
  action: 'run' | 'slide' | 'jump' | 'touch' | 'sprint' | 'rest' | 'shoot' | 'layup' | 'dribble';
  label?: string;
}

export interface Drill3D {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  instructions: string[];
  repsSets: string;
  intensity: 'Media' | 'Alta' | 'Máxima Explosión';
  targetMuscles: string[];
  points: DrillPoint3D[];
  cones: { x: number; z: number }[];
  cameraPreset: 'general' | 'rim' | 'top' | 'cones';
}
