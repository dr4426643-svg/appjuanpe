import { 
  ClubSettings, 
  DailyWorkout, 
  PlayerRecord, 
  BasketballMatch,
  Drill3D 
} from '../types/basketball';

export const DEFAULT_CLUB_SETTINGS: ClubSettings = {
  teamName: 'Survivors de Mellado',
  city: 'Mellado',
  tagline: 'Fuerza, Disciplina y Victoria en Cancha',
  coachName: 'Prof. Carlos Mellado',
  logoUrl: '/src/assets/images/survivors_team_crest_1793843097650.jpg',
  primaryColor: '#F59E0B',
  secondaryColor: '#090D16'
};

export const WEEKLY_WORKOUTS: DailyWorkout[] = [
  {
    day: 'lunes',
    dayTitle: 'Lunes - Potencia y Salto Vertical',
    focusTitle: 'Pliometría en Cancha y Despegue a Dos Pies',
    stretchTotalMin: 8,
    jogTotalMin: 10,
    mainWorkoutMin: 25,
    description: 'Enfocado en activar la fibra muscular rápida para ganar centímetros sobre el aro y asegurar rebotes ofensivos y defensivos.',
    stretches: [
      {
        id: 'st_1',
        name: 'Estiramiento Dinámico de Gemelos y Tendón de Aquiles',
        durationSec: 90,
        muscleGroup: 'Tríceps sural y sóleo',
        instructions: 'Apóyate contra la pared o tablero, una pierna atrás con talón apoyado en el suelo y flexiona rodilla delantera sin despegar el talón.'
      },
      {
        id: 'st_2',
        name: 'Isquiotibiales con Paso Al Frente y Balanceo',
        durationSec: 90,
        muscleGroup: 'Isquiosurales',
        instructions: 'Da un paso corto, talón al suelo y punta hacia arriba; baja la cadera con espalda recta simulando barrer el suelo con las manos.'
      },
      {
        id: 'st_3',
        name: 'Apertura Dinámica de Cadera e Ingle (Gate Opener)',
        durationSec: 90,
        muscleGroup: 'Psoas y aductores',
        instructions: 'Eleva la rodilla a 90° al frente, ábrela lateralmente en semicírculo y desciende con control. Alterna piernas.'
      },
      {
        id: 'st_4',
        name: 'Movilidad de Hombros y Pectoral con Elásticos',
        durationSec: 90,
        muscleGroup: 'Deltoides y pectoral',
        instructions: 'Brazos extendidos abriendo el pecho, simulando la recepción y pase rápido de balón.'
      }
    ],
    jogPhases: [
      {
        id: 'jg_1',
        name: 'Trote Suave Cancha a Cancha',
        durationSec: 180,
        targetHeartRate: '110-120 lpm',
        instructions: 'Idas y vueltas a ritmo continuo respirando por la nariz. Acompaña con braceo natural.'
      },
      {
        id: 'jg_2',
        name: 'Trote con Talones a Glúteos y Rodillas Altas',
        durationSec: 180,
        targetHeartRate: '130-145 lpm',
        instructions: 'Una vuelta con talones a glúteos, regreso caminando 5 segundos, y siguiente vuelta con rodillas altas (skipping).'
      },
      {
        id: 'jg_3',
        name: 'Trote Progresivo con Paradas en 1 Tiempo',
        durationSec: 240,
        targetHeartRate: '145-160 lpm',
        instructions: 'Inicia al 50%, acelera al 80% en media cancha y clava parada defensiva a dos pies antes de la línea de fondo.'
      }
    ],
    exercises: [
      {
        id: 'ex_lun_1',
        name: 'Saltos Pliométricos al Tablero (Toque Máximo)',
        category: 'explosividad',
        setsReps: '4 series × 8 saltos máximos',
        tacticalObjective: 'Dominar las alturas de Mellado, tiempo de segundo salto y toque de aro.',
        detailedExplanation: 'Colócate bajo la canasta en posición básica. Flexiona a 90° con braceo hacia atrás y despega con ambos pies buscando tocar la parte superior del tablero.',
        courtTip: 'No te detengas al aterrizar: aprovecha la energía elástica del suelo para despegar de inmediato.',
        drill3dId: 'pliometria_aro'
      },
      {
        id: 'ex_lun_2',
        name: 'Sentadillas Pliométricas Tuck Jumps',
        category: 'explosividad',
        setsReps: '4 series × 10 repeticiones',
        tacticalObjective: 'Potencia neuromuscular para entradas en bandeja con contacto.',
        detailedExplanation: 'Baja en sentadilla controlada y salta verticalmente llevando rodillas al pecho sin inclinar el torso hacia adelante.',
        courtTip: 'Aterriza en metatarsos sin golpear duro los talones para proteger meniscos.'
      },
      {
        id: 'ex_lun_3',
        name: 'Drop Jumps Reactivos desde Cono/Peldaño',
        category: 'explosividad',
        setsReps: '3 series × 6 saltos reactivos',
        tacticalObjective: 'Reducir el tiempo de contacto en suelo durante fintas y despegues.',
        detailedExplanation: 'Déjate caer desde una altura de 25-30 cm y en cuanto los pies toquen la madera, rebota instantáneamente hacia el aro.',
        courtTip: 'Imagina que el suelo es una plancha ardiendo: ¡mínimo contacto!'
      }
    ],
    coachRating: 4,
    coachFeedback: 'Buen despegue del grupo. Reforzar la amortiguación en el aterrizaje para evitar impacto lumbar.',
    isExtendedForTomorrow: false
  },
  {
    day: 'martes',
    dayTitle: 'Martes - Velocidad y Resistencia Anaeróbica',
    focusTitle: 'Líneas Suicidas y Recuperación Láctica en 4º Cuarto',
    stretchTotalMin: 8,
    jogTotalMin: 12,
    mainWorkoutMin: 28,
    description: 'Acondicionamiento para aguantar minutos de máxima intensidad sin perder lucidez ni efectividad de tiro en momentos decisivos.',
    stretches: [
      {
        id: 'st_mar_1',
        name: 'Estiramiento Dinámico de Cuádriceps con Avance',
        durationSec: 90,
        muscleGroup: 'Cuádriceps femoral',
        instructions: 'Toma el tobillo por detrás acercando el talón al glúteo, mantén rodillas alineadas y da un paso al frente.'
      },
      {
        id: 'st_mar_2',
        name: 'Zancada Profunda de Velocista (Lunge con Giro)',
        durationSec: 90,
        muscleGroup: 'Glúteos y flexores de cadera',
        instructions: 'Paso largo en zancada, apoya rodilla trasera casi al suelo y gira el tronco hacia el lado de la pierna adelantada.'
      },
      {
        id: 'st_mar_3',
        name: 'Rotaciones de Tronco y Flexión Lateral',
        durationSec: 90,
        muscleGroup: 'Core oblicuo y lumbares',
        instructions: 'Pies separados, brazos en cruz girando controladamente de lado a lado para preparar aceleraciones bruscas.'
      },
      {
        id: 'st_mar_4',
        name: 'Péculo Cruzado de Piernas en Movimiento',
        durationSec: 90,
        muscleGroup: 'Fascia lata y glúteo medio',
        instructions: 'Cruce de piernas alternando el apoyo al frente para elongar la banda iliotibial.'
      }
    ],
    jogPhases: [
      {
        id: 'jg_mar_1',
        name: 'Trote en Rombo Cancha Entera',
        durationSec: 240,
        targetHeartRate: '120-135 lpm',
        instructions: 'Trote dibujando diagonales de esquina a codo de tiro libre y luego a media cancha.'
      },
      {
        id: 'jg_mar_2',
        name: 'Trote en Desplazamiento Lateral Continuo',
        durationSec: 240,
        targetHeartRate: '135-150 lpm',
        instructions: 'Desplazamiento lateral sin juntar pies por toda la línea de 3 puntos de ambos aros.'
      },
      {
        id: 'jg_mar_3',
        name: 'Aceleraciones de 15 Metros con Desaceleración',
        durationSec: 240,
        targetHeartRate: '155-170 lpm',
        instructions: 'Sprint explosivo desde línea de fondo hasta el círculo central, frena en 3 pasos y regresa trotando suave.'
      }
    ],
    exercises: [
      {
        id: 'ex_mar_1',
        name: 'Líneas Suicidas Survivors (Shuttle Runs)',
        category: 'resistencia',
        setsReps: '4 repeticiones a muerte · 90s recuperación',
        tacticalObjective: 'Resistencia pura de contraataque y balance defensivo.',
        detailedExplanation: 'Fondo a tiro libre (vuelta), fondo a media cancha (vuelta), fondo a tiro libre contrario (vuelta), fondo a fondo (vuelta).',
        courtTip: 'Toca cada línea con la palma de la mano; flexiona rodillas, no dobles solo la cintura.',
        drill3dId: 'suicidas'
      },
      {
        id: 'ex_mar_2',
        name: 'Test de 17s Cancha a Cancha',
        category: 'resistencia',
        setsReps: '3 series de 17 cruces en menos de 60s',
        tacticalObjective: 'Capacidad glucolítica anaeróbica en situaciones de presión.',
        detailedExplanation: 'Cruza de línea lateral a línea lateral 17 veces consecutivas sin parar. Cada cruce debe hacerse en menos de 3.5 segundos.',
        courtTip: 'Empuja con fuerza en cada cambio de sentido clavando el pie externo.'
      },
      {
        id: 'ex_mar_3',
        name: 'Sprints de Contraataque 1c0 con Freno en Pintura',
        category: 'resistencia',
        setsReps: '5 repeticiones ida y vuelta',
        tacticalObjective: 'Transición rápida y control de velocidad para no cometer falta en ataque.',
        detailedExplanation: 'Sprint al aro contrario a 100%, frena en dos tiempos en la zona restringida y regresa de espaldas defendiendo.',
        courtTip: 'Mantén la mirada al frente como si estuvieras leyendo el repliegue defensivo.'
      }
    ],
    coachRating: 3,
    coachFeedback: 'Varios jugadores bajaron la intensidad en la 3ra serie de suicidios. Se requiere prórroga técnica mañana.',
    isExtendedForTomorrow: true,
    adaptedTomorrowFocus: 'Se añadirán 2 series extras de resistencia láctica al cierre del entrenamiento del Miércoles.'
  },
  {
    day: 'miercoles',
    dayTitle: 'Miércoles - Desplazamiento Defensivo y Agilidad',
    focusTitle: 'Guardia Baja, Drop-Step y Cierre de Penetración',
    stretchTotalMin: 10,
    jogTotalMin: 10,
    mainWorkoutMin: 22,
    description: 'La defensa gana campeonatos. Trabajo de coordinación de pies, velocidad lateral y recuperación de línea de pase.',
    stretches: [
      {
        id: 'st_mie_1',
        name: 'Estiramiento Profundo de Aductores en Mariposa',
        durationSec: 120,
        muscleGroup: 'Aductores y pubis',
        instructions: 'Sentado en el suelo, plantas de los pies unidas; presiona suavemente las rodillas hacia el piso manteniendo pecho erguido.'
      },
      {
        id: 'st_mie_2',
        name: 'Estocada Lateral Cosaca Dinámica (Cossack Squat)',
        durationSec: 120,
        muscleGroup: 'Glúteo medio y tobillos',
        instructions: 'Pies muy separados; baja el peso hacia una pierna flexionando al máximo mientras la otra queda extendida con talón apoyado.'
      },
      {
        id: 'st_mie_3',
        name: 'Movilidad de Cadera 90/90 en el Suelo',
        durationSec: 120,
        muscleGroup: 'Rotadores internos y externos de cadera',
        instructions: 'Sentado con rodillas flexionadas a 90° al frente y a 90° lateral; rota las piernas de un lado a otro sin despegar los talones.'
      },
      {
        id: 'st_mie_4',
        name: 'Estiramiento de Pectorales en Poste de Canasta',
        durationSec: 120,
        muscleGroup: 'Pectoral mayor y bíceps',
        instructions: 'Apoya el antebrazo en el poste acolchado y gira el cuerpo hacia el lado contrario para abrir el pecho.'
      }
    ],
    jogPhases: [
      {
        id: 'jg_mie_1',
        name: 'Trote con Pasos Rusos y Tijeras',
        durationSec: 200,
        targetHeartRate: '120-130 lpm',
        instructions: 'Piernas rectas pateando al frente con apoyo activo de metatarsos.'
      },
      {
        id: 'jg_mie_2',
        name: 'Trote en Zig-Zag entre Línea de 3 y Tiro Libre',
        durationSec: 200,
        targetHeartRate: '135-145 lpm',
        instructions: 'Cambia de ritmo en cada vértice de la cancha alternando apoyos.'
      },
      {
        id: 'jg_mie_3',
        name: 'Deslizamiento Defensivo en Espejo (1c1 sin Balón)',
        durationSec: 200,
        targetHeartRate: '150-165 lpm',
        instructions: 'En parejas: uno marca la dirección con pasos laterales y el compañero debe imitarlo sin perder distancia.'
      }
    ],
    exercises: [
      {
        id: 'ex_mie_1',
        name: 'Zig-Zag Defensivo con Conos (Drop Step)',
        category: 'agilidad',
        setsReps: '5 repeticiones de ida y vuelta · 45s pausa',
        tacticalObjective: 'Impedir que el base rival gane la línea de fondo.',
        detailedExplanation: 'Postura defensiva con centro de gravedad bajo, pecho al frente. Al llegar al cono, realiza el paso de caída con el pie interior y cambia de diagonal.',
        courtTip: 'Nunca cruces los pies. Manos activas: una arriba contestando pase y otra abajo buscando el balón.',
        drill3dId: 'zigzag_defensa'
      },
      {
        id: 'ex_mie_2',
        name: 'Closeout al Tirador y Contestación con Palma Alta',
        category: 'agilidad',
        setsReps: '4 series × 6 salidas explosivas',
        tacticalObjective: 'Puntear tiros exteriores sin morder la finta ni cometer falta.',
        detailedExplanation: 'Sprint de 4 metros hacia la línea de triple, frena con pasos picados y cortos (choppy feet), eleva la mano dominante y mantén el equilibrio.',
        courtTip: 'No saltes a menos que el atacante ya esté en el aire con el balón arriba.'
      },
      {
        id: 'ex_mie_3',
        name: 'Deslizamiento Lateral de Poste a Poste en Pintura',
        category: 'agilidad',
        setsReps: '4 series de 30 segundos continuos',
        tacticalObjective: 'Cerrar la zona restrictiva a pívots y aleros penetradores.',
        detailedExplanation: 'Desplázate a máxima velocidad tocando la línea lateral de la pintura a cada lado alternadamente.',
        courtTip: 'Mantén la cabeza erguida viendo el balón ficticio en la cabecera.'
      }
    ],
    coachRating: 5,
    coachFeedback: 'Excelente actitud y postura baja de todo el equipo en los conos. Desplazamientos limpios.',
    isExtendedForTomorrow: false
  },
  {
    day: 'jueves',
    dayTitle: 'Jueves - Fuerza de Contacto y Choque en Pintura',
    focusTitle: 'Núcleo Indestructible, Ganar el Rebote y Posteo',
    stretchTotalMin: 8,
    jogTotalMin: 8,
    mainWorkoutMin: 24,
    description: 'En baloncesto moderno el contacto es constante. Este día refuerza el tronco, hombros y cuádriceps para no ceder posición física bajo el aro.',
    stretches: [
      {
        id: 'st_jue_1',
        name: 'Perro Boca Abajo a Cobra Dinámica',
        durationSec: 120,
        muscleGroup: 'Cadena posterior y abdominales',
        instructions: 'Pasa de empujar talones al suelo con cadera alta a descender pelvis y abrir pecho mirando al techo.'
      },
      {
        id: 'st_jue_2',
        name: 'Estiramiento de Piramidal y Glúteo en 4',
        durationSec: 120,
        muscleGroup: 'Piramidal y rotadores profundos',
        instructions: 'Cruza un tobillo sobre la rodilla contraria y jala el muslo hacia el pecho para liberar tensión del ciático.'
      },
      {
        id: 'st_jue_3',
        name: 'Dislocaciones de Hombro con Pica o Balón',
        durationSec: 120,
        muscleGroup: 'Manguito rotador',
        instructions: 'Agarre amplio pasando los brazos por encima de la cabeza hacia atrás sin flexionar codos.'
      },
      {
        id: 'st_jue_4',
        name: 'Flexión de Tobillo con Rodilla Adelantada contra Pared',
        durationSec: 120,
        muscleGroup: 'Dorsiflexión de tobillo',
        instructions: 'Punta del pie a 10 cm de la pared; empuja la rodilla hacia la pared sin despegar el talón del suelo.'
      }
    ],
    jogPhases: [
      {
        id: 'jg_jue_1',
        name: 'Trote con Cambios de Sentido al Silbato',
        durationSec: 160,
        targetHeartRate: '120-130 lpm',
        instructions: 'Trote suave; al sonar el silbato gira 180° y continúa sprintando 5 metros.'
      },
      {
        id: 'jg_jue_2',
        name: 'Trote con Flexiones en Pintura',
        durationSec: 160,
        targetHeartRate: '135-150 lpm',
        instructions: 'Llega al área de pintura, haz 3 flexiones rápidas y sal trotando hacia el otro aro.'
      },
      {
        id: 'jg_jue_3',
        name: 'Trote con Paso de Oso (Bear Crawl)',
        durationSec: 160,
        targetHeartRate: '145-160 lpm',
        instructions: 'Trote a media cancha y desde ahí 10 metros en cuadrupedia baja activando el core.'
      }
    ],
    exercises: [
      {
        id: 'ex_jue_1',
        name: 'Planchas Isométricas con Rotación de Balón',
        category: 'fuerza',
        setsReps: '4 series × 45 segundos',
        tacticalObjective: 'Resistir empujones en el aire durante tiros y rebotes.',
        detailedExplanation: 'En posición de plancha frontal, pasa el balón de una mano a la otra en círculos sin balancear la cadera.',
        courtTip: 'Glúteos y abdomen apretados como una roca.'
      },
      {
        id: 'ex_jue_2',
        name: 'Saltos de Rebote en Tráfico con Contacto Simulado',
        category: 'fuerza',
        setsReps: '4 series × 6 repeticiones en parejas',
        tacticalObjective: 'Asegurar el balón con ambas manos tras choque en el aire.',
        detailedExplanation: 'Dos jugadores saltan simultáneamente al aro chocando hombro con hombro en el aire; el rebotador debe bajar el balón con codos abiertos.',
        courtTip: 'Balón pegado a la barbilla, nunca bajes el balón a la cintura tras el rebote.'
      },
      {
        id: 'ex_jue_3',
        name: 'Flexiones Explosivas con Palmada',
        category: 'fuerza',
        setsReps: '4 series × 10 repeticiones',
        tacticalObjective: 'Potencia de empuje para pases de pecho largos de contraataque.',
        detailedExplanation: 'Baja el pecho al suelo y empuja con violencia para despegar las manos y dar una palmada antes de amortiguar.',
        courtTip: 'Si se fatigan los brazos, realizar el empuje explosivo sin palmada manteniendo alineación corporal.'
      }
    ],
    coachRating: 4,
    coachFeedback: 'Buena intensidad en la lucha por el rebote. Buen contacto físico sin faltas.',
    isExtendedForTomorrow: false
  },
  {
    day: 'viernes',
    dayTitle: 'Viernes - Puesta a Punto Pre-Partido',
    focusTitle: 'Táctica Dinámica, Tiros en Fatiga y Velocidad de Reacción',
    stretchTotalMin: 12,
    jogTotalMin: 8,
    mainWorkoutMin: 20,
    description: 'Entrenamiento de precisión. Se baja el volumen físico y se sube la concentración mental, tiros decisivos y velocidad de reacción.',
    stretches: [
      {
        id: 'st_vie_1',
        name: 'Movilidad Articular Integral de Muñeca y Dedos',
        durationSec: 180,
        muscleGroup: 'Antebrazos y flexores de muñeca',
        instructions: 'Círculos de muñecas, estiramiento de flexores y palmas unidas para afinar el golpe de muñeca (follow-through) del tiro.'
      },
      {
        id: 'st_vie_2',
        name: 'Estiramiento Balístico Suave de Piernas en Poste',
        durationSec: 180,
        muscleGroup: 'Isquiotibiales y cadera',
        instructions: 'Balanceo de piernas al frente y atrás de forma pendular suave para soltar la musculatura.'
      },
      {
        id: 'st_vie_3',
        name: 'Respiración Diafragmática y Elongación Lumbar',
        durationSec: 180,
        muscleGroup: 'Diafragma y cuadrado lumbar',
        instructions: 'Acostado boca arriba, rodillas flexionadas al pecho; inhala en 4 segundos inflando el abdomen y exhala en 6 segundos soltando tensión.'
      },
      {
        id: 'st_vie_4',
        name: 'Estiramiento Cervical y Trapecios',
        durationSec: 180,
        muscleGroup: 'Trapecios y cuello',
        instructions: 'Inclinaciones laterales de cabeza suaves para despejar tensión acumulada antes del partido.'
      }
    ],
    jogPhases: [
      {
        id: 'jg_vie_1',
        name: 'Trote Ligero con Balón Botando Suave',
        durationSec: 160,
        targetHeartRate: '110-120 lpm',
        instructions: 'Bote de balón con mano hábil e inhábil recorriendo la pista a trote cómodo.'
      },
      {
        id: 'jg_vie_2',
        name: 'Trote con Freno y Tiro en Suspensión Suave',
        durationSec: 160,
        targetHeartRate: '120-135 lpm',
        instructions: 'Pase a compañero, trote al codo de tiro libre y lanzamiento suave buscando el aro.'
      },
      {
        id: 'jg_vie_3',
        name: 'Trote Táctico Ocupando Espacios de Transición',
        durationSec: 160,
        targetHeartRate: '130-140 lpm',
        instructions: 'Correr a las esquinas y cabecera ocupando el spacing ofensivo de Survivors.'
      }
    ],
    exercises: [
      {
        id: 'ex_vie_1',
        name: 'Tiros Libres Bajo Presión Cardíaca (Clutch Time)',
        category: 'tecnica',
        setsReps: '5 rondas × 2 tiros libres tras sprint',
        tacticalObjective: 'Calma y mecánica perfecta en la línea cuando el partido está en juego.',
        detailedExplanation: 'Sprint de ida y vuelta a media cancha y de inmediato a la línea de tiro libre. El equipo cuenta en voz alta simulando afición rival.',
        courtTip: 'Respira hondo dos veces, bota 3 veces, fija la mirada en la parte trasera del aro y suelta el tiro.'
      },
      {
        id: 'ex_vie_2',
        name: 'Transición Rápida 3c2 a 2c1 en Superioridad',
        category: 'tecnica',
        setsReps: '8 repeticiones a ritmo de partido',
        tacticalObjective: 'Anotar en 4 segundos en contraataque o replegar protegiendo el aro.',
        detailedExplanation: 'Tres atacantes avanzan contra dos defensores; al finalizar el tiro, el que tiró baja a defender en 2c1 en el aro contrario.',
        courtTip: 'Pases rápidos y decisivos; el balón viaja más rápido por el aire que botando.'
      },
      {
        id: 'ex_vie_3',
        name: 'Repaso Táctico de Jugadas de Saque de Banda y Fondo',
        category: 'tecnica',
        setsReps: '6 repeticiones de cada sistema',
        tacticalObjective: 'Canastas fáciles tras tiempo muerto o saque en los últimos segundos.',
        detailedExplanation: 'Ejecución a ritmo de juego de bloqueos indirectos (stagger, pin-down) para dejar solo al tirador en la esquina.',
        courtTip: 'El bloqueador debe poner un bloqueo sólido con los pies bien plantados.'
      }
    ],
    coachRating: 5,
    coachFeedback: 'Mecánica de tiro impecable y alta concentración. El equipo está listo para el juego.',
    isExtendedForTomorrow: false
  }
];

export const INITIAL_PLAYERS: PlayerRecord[] = [
  {
    id: 'p_1',
    fullName: 'Carlos Mellado Jr.',
    idCard: 'V-28.450.912',
    age: 21,
    birthDate: '2005-04-12',
    joinDate: '2023-02-15',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop&q=80',
    dorsal: 7,
    position: 'Base',
    heightCm: 183,
    weightKg: 78,
    status: 'Activo',
    todayAttendance: 'Presente',
    attendanceNotes: 'Puntual en el calentamiento de estiramiento',
    totalAttendances: 42,
    totalMissed: 2
  },
  {
    id: 'p_2',
    fullName: 'Javier "La Chispa" Santos',
    idCard: 'V-27.891.034',
    age: 23,
    birthDate: '2003-09-28',
    joinDate: '2023-03-01',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    dorsal: 23,
    position: 'Escolta',
    heightCm: 191,
    weightKg: 85,
    status: 'Activo',
    todayAttendance: 'Presente',
    attendanceNotes: 'Excelente ritmo en los suicidios',
    totalAttendances: 44,
    totalMissed: 0
  },
  {
    id: 'p_3',
    fullName: 'Mateo "Torre" Rivera',
    idCard: 'V-26.115.849',
    age: 25,
    birthDate: '2001-11-14',
    joinDate: '2023-01-10',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    dorsal: 34,
    position: 'Pívot',
    heightCm: 204,
    weightKg: 104,
    status: 'Activo',
    todayAttendance: 'Presente',
    attendanceNotes: 'Completó 8 saltos al aro',
    totalAttendances: 41,
    totalMissed: 3
  },
  {
    id: 'p_4',
    fullName: 'Andrés Morales',
    idCard: 'V-29.340.118',
    age: 20,
    birthDate: '2006-02-05',
    joinDate: '2023-08-20',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    dorsal: 11,
    position: 'Alero',
    heightCm: 196,
    weightKg: 88,
    status: 'Activo',
    todayAttendance: 'Retraso',
    attendanceNotes: 'Llegó 5 min tarde por estudios',
    totalAttendances: 39,
    totalMissed: 4
  },
  {
    id: 'p_5',
    fullName: 'Diego Flores',
    idCard: 'V-27.401.782',
    age: 22,
    birthDate: '2004-06-18',
    joinDate: '2023-05-12',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    dorsal: 4,
    position: 'Ala-Pívot',
    heightCm: 198,
    weightKg: 93,
    status: 'Activo',
    todayAttendance: 'Presente',
    attendanceNotes: 'Fuerte en la pintura',
    totalAttendances: 43,
    totalMissed: 1
  },
  {
    id: 'p_6',
    fullName: 'Alejandro "Mamba" Díaz',
    idCard: 'V-28.712.554',
    age: 21,
    birthDate: '2005-10-30',
    joinDate: '2024-01-15',
    leaveDate: 'Activo',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    dorsal: 10,
    position: 'Escolta',
    heightCm: 188,
    weightKg: 81,
    status: 'Activo',
    todayAttendance: 'Presente',
    attendanceNotes: 'Tirador de 3 puntos afinado',
    totalAttendances: 38,
    totalMissed: 2
  }
];

export const INITIAL_MATCHES: BasketballMatch[] = [
  {
    id: 'm_1',
    date: '2026-10-28',
    time: '19:30',
    homeTeam: 'Survivors de Mellado',
    awayTeam: 'Titanes de San Juan',
    homeScore: 84,
    awayScore: 78,
    homeQuarterScores: [22, 19, 21, 22],
    awayQuarterScores: [18, 20, 22, 18],
    currentQuarter: 5,
    quarterSecondsLeft: 0,
    isMatchFinished: true,
    isPaused: false,
    location: 'Gimnasio Municipal de Mellado',
    notes: 'Victoria reñida con gran remontada en el 4º cuarto.',
    survivorsPlayers: [
      { playerId: 'p_2', name: 'Javier Santos', dorsal: 23, position: 'Escolta', points: 26, fouls: 2, rebounds: 6, assists: 4 },
      { playerId: 'p_1', name: 'Carlos Mellado Jr.', dorsal: 7, position: 'Base', points: 19, fouls: 3, rebounds: 4, assists: 9 },
      { playerId: 'p_3', name: 'Mateo Rivera', dorsal: 34, position: 'Pívot', points: 16, fouls: 4, rebounds: 14, assists: 1 },
      { playerId: 'p_5', name: 'Diego Flores', dorsal: 4, position: 'Ala-Pívot', points: 13, fouls: 2, rebounds: 8, assists: 2 },
      { playerId: 'p_4', name: 'Andrés Morales', dorsal: 11, position: 'Alero', points: 10, fouls: 1, rebounds: 5, assists: 3 }
    ]
  },
  {
    id: 'm_2',
    date: '2026-10-22',
    time: '18:00',
    homeTeam: 'Halcones Dorados',
    awayTeam: 'Survivors de Mellado',
    homeScore: 71,
    awayScore: 79,
    homeQuarterScores: [16, 20, 19, 16],
    awayQuarterScores: [20, 18, 22, 19],
    currentQuarter: 5,
    quarterSecondsLeft: 0,
    isMatchFinished: true,
    isPaused: false,
    location: 'Cancha Central La Candelaria',
    notes: 'Gran defensa de perímetro conteniendo los triples rivales.',
    survivorsPlayers: [
      { playerId: 'p_1', name: 'Carlos Mellado Jr.', dorsal: 7, position: 'Base', points: 22, fouls: 2, rebounds: 3, assists: 11 },
      { playerId: 'p_2', name: 'Javier Santos', dorsal: 23, position: 'Escolta', points: 21, fouls: 3, rebounds: 5, assists: 3 },
      { playerId: 'p_3', name: 'Mateo Rivera', dorsal: 34, position: 'Pívot', points: 18, fouls: 3, rebounds: 16, assists: 0 },
      { playerId: 'p_6', name: 'Alejandro Díaz', dorsal: 10, position: 'Escolta', points: 12, fouls: 1, rebounds: 2, assists: 1 },
      { playerId: 'p_5', name: 'Diego Flores', dorsal: 4, position: 'Ala-Pívot', points: 6, fouls: 4, rebounds: 7, assists: 1 }
    ]
  },
  {
    id: 'm_3',
    date: '2026-10-15',
    time: '20:00',
    homeTeam: 'Survivors de Mellado',
    awayTeam: 'Guerreros del Valle',
    homeScore: 68,
    awayScore: 74,
    homeQuarterScores: [18, 14, 16, 20],
    awayQuarterScores: [20, 19, 17, 18],
    currentQuarter: 5,
    quarterSecondsLeft: 0,
    isMatchFinished: true,
    isPaused: false,
    location: 'Gimnasio Municipal de Mellado',
    notes: 'Partido físico con muchas faltas en la pintura.',
    survivorsPlayers: [
      { playerId: 'p_3', name: 'Mateo Rivera', dorsal: 34, position: 'Pívot', points: 22, fouls: 5, rebounds: 13, assists: 1 },
      { playerId: 'p_2', name: 'Javier Santos', dorsal: 23, position: 'Escolta', points: 18, fouls: 2, rebounds: 4, assists: 2 },
      { playerId: 'p_1', name: 'Carlos Mellado Jr.', dorsal: 7, position: 'Base', points: 14, fouls: 4, rebounds: 2, assists: 7 },
      { playerId: 'p_4', name: 'Andrés Morales', dorsal: 11, position: 'Alero', points: 9, fouls: 3, rebounds: 6, assists: 1 },
      { playerId: 'p_5', name: 'Diego Flores', dorsal: 4, position: 'Ala-Pívot', points: 5, fouls: 3, rebounds: 5, assists: 0 }
    ]
  }
];

export const DRILLS_3D: Drill3D[] = [
  {
    id: 'tiro_aro',
    name: 'Lanzamiento al Aro (Tiro y Canasta)',
    category: 'tiro',
    tagline: 'Mecánica de Tiro, Elevación y Canasta Limpia',
    description: 'El jugador corre botando el balón desde media cancha, frena en suspensión en el perímetro, se eleva lanzando el balón al aro, el balón entra limpio por la red y bota en la duela.',
    intensity: 'Alta',
    repsSets: '5 series de 10 lanzamientos · Enfoque en mecánica',
    targetMuscles: ['Deltoides', 'Tríceps', 'Flexores de Muñeca', 'Cuádriceps'],
    instructions: [
      'Aproximación con bote controlado atacando el espacio libre.',
      'Parada en un tiempo o dos tiempos clavando los pies hacia el aro.',
      'Elevación vertical con el balón subiendo directo al punto de tiro.',
      'Extensión completa del codo, golpe de muñeca (follow-through) y el balón entra por el aro.',
      'Aterrizaje en el mismo lugar con balance perfecto.'
    ],
    cones: [
      { x: -7.5, z: -2.0 },
      { x: -7.5, z: 2.0 }
    ],
    points: [
      { x: 1.0, y: 0.1, z: 0.5, action: 'dribble', label: 'Bote desde Media Cancha' },
      { x: -3.5, y: 0.1, z: 0.3, action: 'dribble', label: 'Aproximación al Perímetro' },
      { x: -7.5, y: 0.1, z: 0.1, action: 'dribble', label: 'Freno en Suspensión' },
      { x: -7.5, y: 0.85, z: 0.1, action: 'shoot', label: '¡Lanzamiento al Aro!' },
      { x: -7.5, y: 0.1, z: 0.1, action: 'rest', label: '¡Canasta! y Aterrizaje' }
    ],
    cameraPreset: 'general'
  },
  {
    id: 'zigzag_defensa',
    name: 'Zig-Zag Defensivo con Conos',
    category: 'agilidad',
    tagline: 'Desplazamiento Lateral entre Conos y Drop-Step',
    description: 'Conos claramente colocados en la duela marcando la ruta. El jugador adopta guardia baja con brazos extendidos y se desplaza entre cono y cono sin cruzar los pies.',
    intensity: 'Alta',
    repsSets: '5 series de ida y vuelta · 45s descanso',
    targetMuscles: ['Aductores', 'Glúteo Medio', 'Isquiotibiales', 'Core Oblicuo'],
    instructions: [
      'Posición defensiva: centro de gravedad bajo, pecho al frente, brazos abiertos y activos.',
      'Desplázate lateralmente empujando con la pierna trasera hacia el cono 1.',
      'Al llegar al cono, realiza el drop step con el pie interior y cambia de diagonal hacia el cono 2.',
      'Recorre los 5 conos manteniendo la postura baja y cabeza erguida.'
    ],
    cones: [
      { x: -11, z: -3.2 },
      { x: -8, z: 3.2 },
      { x: -5, z: -3.2 },
      { x: -2, z: 3.2 },
      { x: 1.5, z: -3.2 }
    ],
    points: [
      { x: -13.0, y: 0.1, z: 0, action: 'slide', label: 'Posición Base' },
      { x: -11.0, y: 0.1, z: -3.2, action: 'slide', label: 'Cono 1 (Desplazamiento)' },
      { x: -8.0, y: 0.1, z: 3.2, action: 'slide', label: 'Cono 2 (Drop-Step)' },
      { x: -5.0, y: 0.1, z: -3.2, action: 'slide', label: 'Cono 3 (Cambio de Ritmo)' },
      { x: -2.0, y: 0.1, z: 3.2, action: 'slide', label: 'Cono 4 (Cierre de Línea)' },
      { x: 1.5, y: 0.1, z: -3.2, action: 'slide', label: 'Cono 5 (Salida Rápida)' }
    ],
    cameraPreset: 'cones'
  },
  {
    id: 'suicidas',
    name: 'Líneas Suicidas Cancha Completa',
    category: 'resistencia',
    tagline: 'Sprint de Fondo a Líneas y Retorno',
    description: 'Carrera de resistencia pura: sprint de fondo a línea de tiro libre (toca suelo), sprint a media cancha (toca suelo) y sprint a fondo opuesto de aro a aro.',
    intensity: 'Máxima Explosión',
    repsSets: '4 series · 90s recuperación entre series',
    targetMuscles: ['Cuádriceps', 'Gemelos', 'Sistema Cardiorrespiratorio', 'Glúteos'],
    instructions: [
      'Arranca desde la línea de fondo con postura atlética baja.',
      'Sprint hacia tiro libre (5.8m), agáchate y toca la línea con la mano.',
      'Regresa sprintando a fondo y de inmediato sprint a media cancha (14m).',
      'Toca media cancha, regresa a fondo y sprint final de aro a aro (28m).'
    ],
    cones: [
      { x: -8.5, z: 0 },
      { x: 0, z: 0 },
      { x: 13.5, z: 0 }
    ],
    points: [
      { x: -13.5, y: 0.1, z: 0, action: 'sprint', label: 'Salida Línea de Fondo' },
      { x: -8.5, y: 0.1, z: 0, action: 'touch', label: 'Toca Tiro Libre (5.8m)' },
      { x: -13.5, y: 0.1, z: 0, action: 'sprint', label: 'Retorno a Fondo 1' },
      { x: 0, y: 0.1, z: 0, action: 'touch', label: 'Toca Media Cancha (14m)' },
      { x: -13.5, y: 0.1, z: 0, action: 'sprint', label: 'Retorno a Fondo 2' },
      { x: 13.5, y: 0.1, z: 0, action: 'touch', label: 'Toca Fondo Opuesto (28m)' },
      { x: -13.5, y: 0.1, z: 0, action: 'sprint', label: 'Sprint a Meta Final' }
    ],
    cameraPreset: 'general'
  },
  {
    id: 'entrada_aro',
    name: 'Entrada en Bandeja al Aro',
    category: 'tecnica',
    tagline: 'Doble Paso en Carrera y Canasta al Tablero',
    description: 'Ataque frontal rápido con bote en carrera, recogida en dos tiempos rítmicos, salto en suspensión y bandeja suave contra el tablero entrando al aro.',
    intensity: 'Alta',
    repsSets: '4 series de 6 entradas por lado',
    targetMuscles: ['Gemelos', 'Cuádriceps', 'Coordinación Pisar-Saltar'],
    instructions: [
      'Drible potente desde tres cuartos de cancha.',
      'Primer paso largo de desaceleración y segundo paso corto de elevación.',
      'Eleva la rodilla opuesta hacia el pecho para ganar altura.',
      'Suelta el balón con la yema de los dedos contra el recuadro del tablero.'
    ],
    cones: [
      { x: -6.0, z: -2.0 },
      { x: -9.0, z: -1.2 }
    ],
    points: [
      { x: 1.0, y: 0.1, z: -2.5, action: 'dribble', label: 'Inicio de Contraataque' },
      { x: -5.0, y: 0.1, z: -1.8, action: 'dribble', label: 'Ataque a Canasta' },
      { x: -9.0, y: 0.2, z: -1.0, action: 'dribble', label: 'Paso 1 y Recogida' },
      { x: -11.5, y: 2.3, z: -0.3, action: 'layup', label: '¡Bandeja al Tablero y Aro!' },
      { x: -12.5, y: 0.1, z: -0.3, action: 'rest', label: 'Caída Amortiguada' }
    ],
    cameraPreset: 'rim'
  }
];

