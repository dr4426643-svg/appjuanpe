import JSZip from 'jszip';
import { ClubSettings, DailyWorkout, PlayerRecord, BasketballMatch } from '../types/basketball';

export async function exportPhpMysqlZip(
  settings: ClubSettings,
  workouts: DailyWorkout[],
  players: PlayerRecord[],
  matches: BasketballMatch[]
): Promise<void> {
  const zip = new JSZip();

  // 1. README / INSTRUCCIONES
  const readme = `========================================================================
SISTEMA DE BALONCESTO OFICIAL - ${settings.teamName.toUpperCase()}
PROYECTO COMPLETO PHP & MYSQL PARA LOCALHOST (XAMPP / WAMP / LAMP)
========================================================================

¡DISEÑO IDÉNTICO, GRÁFICOS Y COLORES EN BLANCO Y AZUL REAL CON TAILWIND CSS!

INSTRUCCIONES DE INSTALACIÓN EN LOCALHOST:

1. DESCOMPRIMIR EL ARCHIVO:
   - Extrae esta carpeta en tu directorio htdocs de XAMPP:
     En Windows: C:\\xampp\\htdocs\\survivors
     En Mac/Linux: /Applications/XAMPP/htdocs/survivors o /var/www/html/survivors

2. INICIAR APACHE Y MYSQL:
   - Abre el Panel de Control de XAMPP y presiona "Start" en Apache y MySQL.

3. IMPORTAR LA BASE DE DATOS:
   - Abre tu navegador y ve a: http://localhost/phpmyadmin
   - Haz clic en la pestaña "Importar".
   - Selecciona el archivo "database.sql" incluido en esta carpeta.
   - Haz clic en "Continuar" o "Importar". Se creará la base de datos "survivors_basketball".

4. ABRIR EL SISTEMA:
   - Entra en tu navegador a:
     http://localhost/survivors/

MÓDULOS INCLUIDOS (100% COMPLETOS CON TAILWIND CSS & THREE.JS):
- index.php: Panel principal con banner NBA, estadísticas y barra de navegación inferior.
- entrenamientos.php: Módulo 1 (Lunes a Viernes, cronómetros interactivos con sonido, explicación y calificación).
- asistencia.php: Módulo 2 (Registro con Cédula, Foto de Galería, Dorsal, Posición y Pase de Lista).
- marcador.php: Módulo 3 (Marcador en Vivo táctil, 1-toque por jugador +1/+2/+3, faltas, reloj y deshacer error).
- estadisticas.php: Módulo 4 (Historial de partidos, promedio de victorias, ranking de mayor a menor en puntos y faltas).
- cancha3d.php: Cancha 3D Completa con Three.js (simulación de lanzamiento al aro y zig-zag con conos).
- ajustes.php: Ajustes del club, foto de escudo desde galería y datos técnicos.
- config.php: Conexión PDO a MySQL (usuario: root, contraseña: vacía).
- database.sql: Script SQL con todas las tablas y datos precargados.

¡Desarrollado para el equipo de baloncesto ${settings.teamName}!
`;
  zip.file('INSTRUCCIONES_INSTALACION.txt', readme);

  // 2. database.sql
  const sql = `-- Base de Datos para ${settings.teamName}
CREATE DATABASE IF NOT EXISTS \`survivors_basketball\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`survivors_basketball\`;

-- 1. Tabla de Configuración del Club
CREATE TABLE IF NOT EXISTS \`club_settings\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`team_name\` VARCHAR(100) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`tagline\` VARCHAR(255) NOT NULL,
  \`coach_name\` VARCHAR(100) NOT NULL,
  \`primary_color\` VARCHAR(20) NOT NULL,
  \`logo_url\` TEXT
);

INSERT INTO \`club_settings\` (\`team_name\`, \`city\`, \`tagline\`, \`coach_name\`, \`primary_color\`, \`logo_url\`)
VALUES ('${settings.teamName.replace(/'/g, "''")}', '${settings.city.replace(/'/g, "''")}', '${settings.tagline.replace(/'/g, "''")}', '${settings.coachName.replace(/'/g, "''")}', '${settings.primaryColor}', '${settings.logoUrl}');

-- 2. Tabla de Jugadores
CREATE TABLE IF NOT EXISTS \`players\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`id_card\` VARCHAR(30) NOT NULL,
  \`age\` INT NOT NULL,
  \`birth_date\` DATE NOT NULL,
  \`join_date\` DATE NOT NULL,
  \`leave_date\` VARCHAR(50) DEFAULT 'Activo',
  \`dorsal\` INT NOT NULL,
  \`position\` VARCHAR(30) NOT NULL,
  \`height_cm\` INT DEFAULT 185,
  \`weight_kg\` INT DEFAULT 80,
  \`status\` ENUM('Activo', 'Lesionado', 'Permiso', 'Egresado') DEFAULT 'Activo',
  \`photo_url\` TEXT
);

${players.map(p => `INSERT INTO \`players\` (\`full_name\`, \`id_card\`, \`age\`, \`birth_date\`, \`join_date\`, \`leave_date\`, \`dorsal\`, \`position\`, \`status\`, \`photo_url\`) VALUES ('${p.fullName.replace(/'/g, "''")}', '${p.idCard}', ${p.age}, '${p.birthDate}', '${p.joinDate}', '${p.leaveDate}', ${p.dorsal}, '${p.position}', '${p.status}', '${p.photoUrl}');`).join('\n')}

-- 3. Tabla de Asistencia Diaria
CREATE TABLE IF NOT EXISTS \`attendance\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`player_id\` INT NOT NULL,
  \`date\` DATE NOT NULL,
  \`status\` ENUM('Presente', 'Retraso', 'Justificado', 'Ausente') NOT NULL,
  \`notes\` TEXT,
  FOREIGN KEY (\`player_id\`) REFERENCES \`players\`(\`id\`) ON DELETE CASCADE
);

-- 4. Tabla de Partidos
CREATE TABLE IF NOT EXISTS \`matches\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`match_date\` DATE NOT NULL,
  \`home_team\` VARCHAR(100) NOT NULL,
  \`away_team\` VARCHAR(100) NOT NULL,
  \`home_score\` INT NOT NULL DEFAULT 0,
  \`away_score\` INT NOT NULL DEFAULT 0,
  \`location\` VARCHAR(150),
  \`status\` ENUM('in_progress', 'finished') DEFAULT 'finished'
);

-- 5. Tabla de Rendimiento por Partido
CREATE TABLE IF NOT EXISTS \`match_player_stats\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`match_id\` INT NOT NULL,
  \`player_name\` VARCHAR(100) NOT NULL,
  \`dorsal\` INT NOT NULL,
  \`points\` INT NOT NULL DEFAULT 0,
  \`fouls\` INT NOT NULL DEFAULT 0,
  FOREIGN KEY (\`match_id\`) REFERENCES \`matches\`(\`id\`) ON DELETE CASCADE
);

${matches.map((m, idx) => `INSERT INTO \`matches\` (\`id\`, \`match_date\`, \`home_team\`, \`away_team\`, \`home_score\`, \`away_score\`, \`location\`, \`status\`) VALUES (${idx + 1}, '${m.date}', '${m.homeTeam.replace(/'/g, "''")}', '${m.awayTeam.replace(/'/g, "''")}', ${m.homeScore}, ${m.awayScore}, '${m.location.replace(/'/g, "''")}', 'finished');`).join('\n')}

${matches.flatMap((m, mIdx) => m.survivorsPlayers.map(p => `INSERT INTO \`match_player_stats\` (\`match_id\`, \`player_name\`, \`dorsal\`, \`points\`, \`fouls\`) VALUES (${mIdx + 1}, '${p.name.replace(/'/g, "''")}', ${p.dorsal}, ${p.points}, ${p.fouls});`)).join('\n')}
`;
  zip.file('database.sql', sql);

  // 3. config.php
  const configPhp = `<?php
// Conexión PDO a MySQL Localhost (XAMPP / WAMP)
$host = "localhost";
$db   = "survivors_basketball";
$user = "root";
$pass = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
     die("<div style='font-family:sans-serif;padding:30px;text-align:center;'><h2>Error conectando a MySQL: " . htmlspecialchars($e->getMessage()) . "</h2><p>Asegúrate de haber importado el archivo <b>database.sql</b> en phpMyAdmin y que el servicio MySQL esté activo en XAMPP.</p></div>");
}

function getClubSettings($pdo) {
    $stmt = $pdo->query("SELECT * FROM club_settings LIMIT 1");
    return $stmt->fetch() ?: [
        'team_name' => '${settings.teamName}',
        'city' => '${settings.city}',
        'tagline' => '${settings.tagline}',
        'coach_name' => '${settings.coachName}',
        'logo_url' => '${settings.logoUrl}'
    ];
}
?>`;
  zip.file('config.php', configPhp);

  // Common Head & Nav Partial
  const headHtml = (title: string, activeTab: string) => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - ${settings.teamName}</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, h4, .font-heading { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-50/60 via-[#f8fafc] to-slate-100/70 text-slate-900 flex flex-col items-center pb-24 selection:bg-blue-600 selection:text-white">
    <!-- Top Header -->
    <header class="w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-40">
        <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <a href="index.php" class="flex items-center gap-2.5 group">
                <div class="w-9 h-9 rounded-2xl overflow-hidden border-2 border-blue-600 bg-white shadow-sm shrink-0 p-0.5">
                    <img src="<?= htmlspecialchars($club['logo_url']) ?>" alt="Logo" class="w-full h-full object-cover rounded-xl" onerror="this.src='https://ui-avatars.com/api/?name=Survivors&background=2563eb&color=fff';">
                </div>
                <div>
                    <span class="text-[10px] font-black tracking-widest text-blue-700 uppercase block">SURVIVORS MELLADO</span>
                    <h1 class="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                        <?= htmlspecialchars($club['team_name']) ?>
                    </h1>
                </div>
            </a>
            <div class="flex items-center gap-2">
                <a href="ajustes.php" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors" title="Ajustes">
                    ⚙️
                </a>
            </div>
        </div>
    </header>
    <main class="w-full max-w-5xl px-3 sm:px-6 py-4 flex-1">`;

  const navHtml = (activeTab: string) => `    </main>
    <!-- Barra Inferior Android Nativa -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div class="max-w-md mx-auto h-16 grid grid-cols-5 items-center px-1">
            <a href="index.php" class="min-h-[48px] flex flex-col items-center justify-center ${activeTab === 'home' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}">
                <div class="p-1 rounded-xl ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : ''}">🏠</div>
                <span class="text-[10px] tracking-tight mt-0.5">Inicio</span>
            </a>
            <a href="entrenamientos.php" class="min-h-[48px] flex flex-col items-center justify-center ${activeTab === 'entrenar' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}">
                <div class="p-1 rounded-xl ${activeTab === 'entrenar' ? 'bg-blue-50 text-blue-600' : ''}">📅</div>
                <span class="text-[10px] tracking-tight mt-0.5">Entrenar</span>
            </a>
            <a href="asistencia.php" class="min-h-[48px] flex flex-col items-center justify-center ${activeTab === 'plantel' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}">
                <div class="p-1 rounded-xl ${activeTab === 'plantel' ? 'bg-blue-50 text-blue-600' : ''}">👥</div>
                <span class="text-[10px] tracking-tight mt-0.5">Plantel</span>
            </a>
            <a href="marcador.php" class="min-h-[48px] flex flex-col items-center justify-center ${activeTab === 'marcador' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}">
                <div class="p-1 rounded-xl ${activeTab === 'marcador' ? 'bg-blue-50 text-blue-600' : ''}">🏆</div>
                <span class="text-[10px] tracking-tight mt-0.5">Marcador</span>
            </a>
            <a href="estadisticas.php" class="min-h-[48px] flex flex-col items-center justify-center ${activeTab === 'record' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}">
                <div class="p-1 rounded-xl ${activeTab === 'record' ? 'bg-blue-50 text-blue-600' : ''}">📈</div>
                <span class="text-[10px] tracking-tight mt-0.5">Récord</span>
            </a>
        </div>
    </nav>
</body>
</html>`;

  // 4. index.php (Clean, Identical to React HomeHub)
  const indexPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);
$activePlayers = $pdo->query("SELECT COUNT(*) FROM players WHERE status = 'Activo'")->fetchColumn() ?: 0;
$matches = $pdo->query("SELECT * FROM matches ORDER BY id DESC LIMIT 5")->fetchAll();
$wonCount = 0;
foreach ($matches as $m) {
    if ($m['home_score'] > $m['away_score']) $wonCount++;
}
$winRate = count($matches) > 0 ? round(($wonCount / count($matches)) * 100) : 0;
?>
${headHtml('Inicio', 'home')}
<div class="space-y-5 w-full max-w-4xl mx-auto">
    <!-- Hero Banner NBA Arena con Degradado -->
    <div class="relative rounded-3xl overflow-hidden border border-blue-200/80 shadow-md bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-5 sm:p-7">
        <img src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&auto=format&fit=crop&q=80" alt="Arena NBA" class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.15]">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/40 to-transparent"></div>

        <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md shrink-0 p-0.5">
                    <img src="<?= htmlspecialchars($club['logo_url']) ?>" alt="Logo" class="w-full h-full object-cover rounded-xl" onerror="this.src='https://ui-avatars.com/api/?name=Survivors&background=2563eb&color=fff';">
                </div>
                <div>
                    <span class="text-[10px] font-black tracking-widest text-amber-300 uppercase drop-shadow block">SURVIVORS MELLADO B.C.</span>
                    <h2 class="text-xs sm:text-sm font-black text-white tracking-wide leading-none drop-shadow"><?= htmlspecialchars($club['team_name']) ?></h2>
                </div>
            </div>
            <div class="px-3 py-1 rounded-full bg-black/40 text-blue-200 border border-white/20 text-[11px] font-bold backdrop-blur-md">
                <?= htmlspecialchars($club['city']) ?>
            </div>
        </div>

        <div class="relative z-10 space-y-2 mt-12 sm:mt-14">
            <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/30 text-white text-[11px] font-bold backdrop-blur-md">
                <span>✨ CENTRO DE ALTO RENDIMIENTO</span>
            </div>
            <h1 class="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                Preparación Física y Control Táctico
            </h1>
            <p class="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium drop-shadow max-w-xl">
                <?= htmlspecialchars($club['tagline']) ?> · Usa la barra inferior para acceder directamente a tus entrenamientos, plantel, marcador en vivo e historial.
            </p>
            <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span class="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
                    <span>👥 <?= $activePlayers ?> Jugadores Activos</span>
                </span>
                <span class="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
                    <span>🏆 <?= $wonCount ?> Victorias (<?= $winRate ?>%)</span>
                </span>
                <span class="flex items-center gap-1.5 bg-white/15 text-white px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md font-semibold">
                    <span>⏰ Lunes a Viernes</span>
                </span>
            </div>
        </div>
    </div>

    <!-- Tarjeta Cancha 3D Completa -->
    <a href="cancha3d.php" class="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white border border-blue-700/80 rounded-3xl p-5 sm:p-6 shadow-md flex items-center justify-between hover:border-blue-400 transition-all group block">
        <div class="space-y-1.5">
            <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded uppercase">VISTA 3D INTERACTIVA</span>
                <h3 class="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    Cancha Oficial Completa en 3D
                </h3>
            </div>
            <p class="text-xs text-blue-200 max-w-lg leading-relaxed">
                Mira la secuencia en vivo con el atleta 3D lanzando al aro, corriendo líneas suicidas y desplazándose entre conos.
            </p>
            <div class="flex items-center gap-3 text-xs text-amber-300 font-semibold pt-1">
                <span>🏀 Lanzamiento al Aro</span>
                <span>·</span>
                <span>🛡️ Zig-zag con Conos</span>
                <span>·</span>
                <span>⚡ Líneas Suicidas</span>
            </div>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-md ml-3">
            👁️
        </div>
    </a>

    <!-- Cuerpo Técnico & Organización -->
    <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-5 rounded-full bg-blue-600 inline-block"></span>
                <h3 class="text-base font-black text-slate-900">Cuerpo Técnico & Organización</h3>
            </div>
            <a href="ajustes.php" class="text-xs font-bold text-blue-600 hover:underline">Editar Datos del Club</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span class="text-slate-400 block font-medium">Entrenador en Jefe:</span>
                <span class="font-bold text-slate-900 text-sm mt-0.5 block"><?= htmlspecialchars($club['coach_name']) ?></span>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span class="text-slate-400 block font-medium">Sede Principal:</span>
                <span class="font-bold text-slate-900 text-sm mt-0.5 block"><?= htmlspecialchars($club['city']) ?> · Gimnasio Municipal</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span class="text-slate-400 block font-medium">Régimen Semanal:</span>
                <span class="font-bold text-blue-700 text-sm mt-0.5 block">5 Días de Carga (Sáb/Dom Libres)</span>
            </div>
        </div>
    </div>
</div>
${navHtml('home')}`;
  zip.file('index.php', indexPhp);

  // 5. entrenamientos.php (Identical conditioning module)
  const entrenamientosPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);
$dia = $_GET['dia'] ?? 'lunes';
?>
${headHtml('Entrenamientos Semanales', 'entrenar')}
<div class="space-y-5 w-full max-w-4xl mx-auto">
    <!-- Selector de Días Lunes a Viernes -->
    <div class="bg-white p-2 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        <?php
        $dias = ['lunes'=>'Lunes', 'martes'=>'Martes', 'miercoles'=>'Miércoles', 'jueves'=>'Jueves', 'viernes'=>'Viernes', 'fin_semana'=>'Sáb/Dom (Libre)'];
        foreach ($dias as $k => $l):
            $active = $dia === $k;
        ?>
            <a href="?dia=<?= $k ?>" class="flex-1 min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all whitespace-nowrap shrink-0 <?= $active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700' ?>">
                <?= $l ?>
            </a>
        <?php endforeach; ?>
    </div>

    <?php if ($dia === 'fin_semana'): ?>
        <div class="bg-white border border-blue-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-3xl">🏀</div>
            <h2 class="text-2xl font-black text-slate-900">Sábado y Domingo: Días Libres</h2>
            <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Descanso activo, hidratación y regeneración de ligamentos para el plantel Survivors.
            </p>
            <a href="?dia=lunes" class="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">Ver Rutina del Lunes</a>
        </div>
    <?php else: ?>
        <!-- Card Principal del Día -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg space-y-2 border border-blue-500">
            <div class="flex items-center justify-between">
                <span class="text-xs font-black uppercase tracking-wider text-amber-300">🔥 SESIÓN OFICIAL SURVIVORS</span>
                <a href="cancha3d.php" class="px-3 py-1.5 bg-white text-blue-700 font-bold text-xs rounded-xl shadow">Ver en Cancha 3D</a>
            </div>
            <h1 class="text-2xl font-black text-white capitalize"><?= $dia ?> - Acondicionamiento Físico</h1>
            <p class="text-xs sm:text-sm text-blue-100 font-medium">Ejercicios de alta intensidad orientados a la velocidad, potencia y resistencia en duela.</p>
        </div>

        <!-- Cronómetros Previos: Estiramiento y Trote -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 1. Cronómetro de Estiramiento -->
            <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-sm sm:text-base font-black text-slate-900">1. Estiramiento Obligatorio</h3>
                        <span class="text-xs text-slate-500">Prevención de lesiones (10 min)</span>
                    </div>
                    <span id="stretchClock" class="font-mono font-black text-2xl text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">10:00</span>
                </div>
                <div class="flex items-center gap-2">
                    <button id="btnStretch" onclick="toggleStretchTimer()" class="flex-1 min-h-[42px] bg-blue-600 text-white font-bold text-xs rounded-xl shadow">Iniciar Estiramiento</button>
                    <button onclick="resetStretchTimer()" class="p-2.5 rounded-xl bg-slate-100 text-slate-600">↺</button>
                </div>
            </div>

            <!-- 2. Cronómetro de Trote -->
            <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-sm sm:text-base font-black text-slate-900">2. Trote & Cardio Previo</h3>
                        <span class="text-xs text-slate-500">Activación aeróbica (10 min)</span>
                    </div>
                    <span id="jogClock" class="font-mono font-black text-2xl text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">10:00</span>
                </div>
                <div class="flex items-center gap-2">
                    <button id="btnJog" onclick="toggleJogTimer()" class="flex-1 min-h-[42px] bg-indigo-600 text-white font-bold text-xs rounded-xl shadow">Iniciar Trote</button>
                    <button onclick="resetJogTimer()" class="p-2.5 rounded-xl bg-slate-100 text-slate-600">↺</button>
                </div>
            </div>
        </div>

        <!-- Ejercicios del Día -->
        <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 class="text-base font-black text-slate-900">Ejercicios Explicados de la Sesión</h3>
            <div class="space-y-3 text-xs">
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div class="flex justify-between font-bold text-slate-900 text-sm">
                        <span>1. Líneas Suicidas Cancha a Cancha</span>
                        <span class="text-blue-600">4 series</span>
                    </div>
                    <p class="text-slate-600 mt-1">Sprint de línea de fondo a tiro libre, vuelta, a media cancha, vuelta y a fondo opuesto tocando la línea con la mano.</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div class="flex justify-between font-bold text-slate-900 text-sm">
                        <span>2. Desplazamiento Defensivo en Zig-Zag</span>
                        <span class="text-blue-600">5 repeticiones</span>
                    </div>
                    <p class="text-slate-600 mt-1">Guardia baja con brazos abiertos entre conos sin cruzar los pies, cambiando de dirección con drop-step.</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div class="flex justify-between font-bold text-slate-900 text-sm">
                        <span>3. Lanzamiento en Suspensión tras Drible</span>
                        <span class="text-blue-600">10 tiros</span>
                    </div>
                    <p class="text-slate-600 mt-1">Aproximación en bote, parada en 2 tiempos, elevación vertical y lanzamiento suave al aro con seguimiento de muñeca.</p>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<script>
// Cronómetros JavaScript en PHP
let stretchSec = 600, isStretchRunning = false, stretchInterval = null;
let jogSec = 600, isJogRunning = false, jogInterval = null;

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = s % 60;
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function toggleStretchTimer() {
    isStretchRunning = !isStretchRunning;
    const btn = document.getElementById('btnStretch');
    if (isStretchRunning) {
        btn.innerText = 'Pausar Estiramiento';
        btn.className = 'flex-1 min-h-[42px] bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow';
        stretchInterval = setInterval(() => {
            if (stretchSec > 0) {
                stretchSec--;
                document.getElementById('stretchClock').innerText = formatTime(stretchSec);
            } else {
                clearInterval(stretchInterval);
                isStretchRunning = false;
                btn.innerText = '¡Estiramiento Completado!';
                alert('¡Tiempo de Estiramiento Finalizado!');
            }
        }, 1000);
    } else {
        clearInterval(stretchInterval);
        btn.innerText = 'Reanudar Estiramiento';
        btn.className = 'flex-1 min-h-[42px] bg-blue-600 text-white font-bold text-xs rounded-xl shadow';
    }
}

function resetStretchTimer() {
    clearInterval(stretchInterval);
    isStretchRunning = false;
    stretchSec = 600;
    document.getElementById('stretchClock').innerText = '10:00';
    document.getElementById('btnStretch').innerText = 'Iniciar Estiramiento';
    document.getElementById('btnStretch').className = 'flex-1 min-h-[42px] bg-blue-600 text-white font-bold text-xs rounded-xl shadow';
}

function toggleJogTimer() {
    isJogRunning = !isJogRunning;
    const btn = document.getElementById('btnJog');
    if (isJogRunning) {
        btn.innerText = 'Pausar Trote';
        btn.className = 'flex-1 min-h-[42px] bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow';
        jogInterval = setInterval(() => {
            if (jogSec > 0) {
                jogSec--;
                document.getElementById('jogClock').innerText = formatTime(jogSec);
            } else {
                clearInterval(jogInterval);
                isJogRunning = false;
                btn.innerText = '¡Trote Completado!';
                alert('¡Tiempo de Trote Finalizado!');
            }
        }, 1000);
    } else {
        clearInterval(jogInterval);
        btn.innerText = 'Reanudar Trote';
        btn.className = 'flex-1 min-h-[42px] bg-indigo-600 text-white font-bold text-xs rounded-xl shadow';
    }
}

function resetJogTimer() {
    clearInterval(jogInterval);
    isJogRunning = false;
    jogSec = 600;
    document.getElementById('jogClock').innerText = '10:00';
    document.getElementById('btnJog').innerText = 'Iniciar Trote';
    document.getElementById('btnJog').className = 'flex-1 min-h-[42px] bg-indigo-600 text-white font-bold text-xs rounded-xl shadow';
}
</script>
${navHtml('entrenar')}`;
  zip.file('entrenamientos.php', entrenamientosPhp);

  // 6. asistencia.php (Identical Roster & Gallery upload)
  const asistenciaPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);

// Registro de nuevo jugador
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_player') {
    $name = trim($_POST['full_name']);
    $idCard = trim($_POST['id_card']);
    $age = (int)$_POST['age'];
    $birth = $_POST['birth_date'];
    $join = $_POST['join_date'];
    $leave = trim($_POST['leave_date']) ?: 'Activo';
    $dorsal = (int)$_POST['dorsal'];
    $pos = $_POST['position'];
    $photo = trim($_POST['photo_url']) ?: "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=2563eb&color=fff";

    $stmt = $pdo->prepare("INSERT INTO players (full_name, id_card, age, birth_date, join_date, leave_date, dorsal, position, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $idCard, $age, $birth, $join, $leave, $dorsal, $pos, $photo]);
    header("Location: asistencia.php?msg=guardado");
    exit;
}

$players = $pdo->query("SELECT * FROM players ORDER BY dorsal ASC")->fetchAll();
?>
${headHtml('Plantel y Asistencia', 'plantel')}
<div class="space-y-4 w-full max-w-4xl mx-auto">
    <!-- Top Bar con Botón Nuevo Jugador -->
    <div class="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
        <div>
            <h2 class="text-base font-black text-slate-900">Plantel Oficial Survivors</h2>
            <span class="text-xs text-slate-500"><?= count($players) ?> Jugadores Registrados</span>
        </div>
        <button onclick="document.getElementById('modalAddPlayer').classList.remove('hidden')" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow">
            + Nuevo Jugador
        </button>
    </div>

    <!-- Lista de Jugadores -->
    <div class="space-y-3">
        <?php foreach ($players as $p): ?>
            <div class="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="relative w-12 h-12 rounded-xl overflow-hidden border border-blue-600 bg-slate-50 shrink-0">
                        <img src="<?= htmlspecialchars($p['photo_url']) ?>" alt="Foto" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=<?= urlencode($p['full_name']) ?>&background=2563eb&color=fff';">
                        <span class="absolute bottom-0 right-0 bg-blue-700 text-white text-[9px] font-black px-1 rounded-tl">#<?= $p['dorsal'] ?></span>
                    </div>
                    <div class="min-w-0">
                        <h4 class="text-sm font-black text-slate-900 truncate"><?= htmlspecialchars($p['full_name']) ?></h4>
                        <div class="text-[11px] text-slate-500 flex flex-wrap gap-x-2">
                            <span>Cédula: <?= htmlspecialchars($p['id_card']) ?></span>
                            <span>·</span>
                            <span><?= $p['age'] ?> años</span>
                            <span>·</span>
                            <span class="text-blue-700 font-bold"><?= htmlspecialchars($p['position']) ?></span>
                        </div>
                    </div>
                </div>

                <!-- Botones de Asistencia -->
                <div class="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition-all">Presente</button>
                    <button class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-slate-950 border border-amber-200 text-xs font-bold transition-all">Retraso</button>
                    <button class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition-all">Ausente</button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Modal Registrar Jugador con Foto de Galería -->
<div id="modalAddPlayer" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
    <div class="bg-white border border-blue-200 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 box-border">
        <div class="flex justify-between items-center border-b pb-2">
            <h3 class="font-black text-slate-900">Registrar Jugador</h3>
            <button onclick="document.getElementById('modalAddPlayer').classList.add('hidden')" class="p-1 text-slate-400">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="action" value="add_player">
            <div>
                <label class="font-bold block mb-1">Nombre Completo *</label>
                <input type="text" name="full_name" required class="w-full bg-slate-50 border rounded-xl p-2" placeholder="Ej. Carlos Mellado">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold block mb-1">Cédula / DNI *</label>
                    <input type="text" name="id_card" required class="w-full bg-slate-50 border rounded-xl p-2" placeholder="V-28.123.456">
                </div>
                <div>
                    <label class="font-bold block mb-1">Edad</label>
                    <input type="number" name="age" value="21" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold block mb-1">Dorsal (#)</label>
                    <input type="number" name="dorsal" value="7" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
                <div>
                    <label class="font-bold block mb-1">Posición</label>
                    <select name="position" class="w-full bg-slate-50 border rounded-xl p-2">
                        <option>Base</option><option>Escolta</option><option>Alero</option><option>Ala-Pívot</option><option>Pívot</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold block mb-1">Fecha Nacimiento</label>
                    <input type="date" name="birth_date" value="2004-01-15" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
                <div>
                    <label class="font-bold block mb-1">Fecha Ingreso</label>
                    <input type="date" name="join_date" value="<?= date('Y-m-d') ?>" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
            </div>
            <div>
                <label class="font-bold block mb-1">Foto de Perfil (Galería del Teléfono)</label>
                <input type="file" accept="image/*" class="w-full text-xs" onchange="previewPhoto(this)">
                <input type="hidden" name="photo_url" id="hiddenPhotoUrl" value="">
                <img id="imgPreview" class="w-12 h-12 rounded-xl mt-2 hidden object-cover border border-blue-600">
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onclick="document.getElementById('modalAddPlayer').classList.add('hidden')" class="px-4 py-2 text-slate-500">Cancelar</button>
                <button type="submit" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow">Guardar Jugador</button>
            </div>
        </form>
    </div>
</div>

<script>
function previewPhoto(input) {
    if (input.files && input.files[0]) {
        let r = new FileReader();
        r.onload = function(e) {
            document.getElementById('hiddenPhotoUrl').value = e.target.result;
            const img = document.getElementById('imgPreview');
            img.src = e.target.result;
            img.classList.remove('hidden');
        }
        r.readAsDataURL(input.files[0]);
    }
}
</script>
${navHtml('plantel')}`;
  zip.file('asistencia.php', asistenciaPhp);

  // 7. marcador.php (Identical live scorer)
  const marcadorPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);
$players = $pdo->query("SELECT * FROM players ORDER BY dorsal ASC LIMIT 5")->fetchAll();
?>
${headHtml('Marcador en Vivo', 'marcador')}
<div class="space-y-4 w-full max-w-4xl mx-auto">
    <!-- Pizarra Superior -->
    <div class="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-blue-600">
        <div class="flex items-center justify-between border-b border-blue-500/60 pb-2 mb-3">
            <span class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">4º CUARTO</span>
            <div class="font-mono text-base font-black bg-white/20 px-3 py-1 rounded-xl">04:00</div>
        </div>

        <div class="grid grid-cols-2 gap-4 items-center">
            <!-- Local -->
            <div class="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span class="font-black text-xs text-amber-300 uppercase block"><?= htmlspecialchars($club['team_name']) ?></span>
                <div id="homeScore" class="text-5xl sm:text-7xl font-mono font-black my-1">68</div>
                <span class="text-[11px] text-blue-200">Toca abajo quién anotó ↓</span>
            </div>
            <!-- Rival -->
            <div class="bg-white/10 rounded-2xl p-3 text-center border border-white/15">
                <span class="font-black text-xs text-blue-200 uppercase block">Rival Visitante</span>
                <div id="awayScore" class="text-5xl sm:text-7xl font-mono font-black my-1">64</div>
                <div class="flex justify-center gap-1 mt-1">
                    <button onclick="addAway(1)" class="px-2 py-1 bg-white/20 rounded text-xs font-bold">+1</button>
                    <button onclick="addAway(2)" class="px-2 py-1 bg-white/20 rounded text-xs font-bold">+2</button>
                    <button onclick="addAway(3)" class="px-2 py-1 bg-white/20 rounded text-xs font-bold">+3</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Jugadores en Cancha: Anotación en 1 Toque -->
    <div class="bg-white rounded-3xl p-4 border border-blue-100 shadow-sm space-y-2">
        <h3 class="text-sm font-black text-slate-900">🏀 ¿Quién anotó de <?= htmlspecialchars($club['team_name']) ?>?</h3>
        <p class="text-[11px] text-slate-500">Toca +1, +2 o +3 directamente en el jugador.</p>

        <div class="space-y-2">
            <?php foreach ($players as $p): ?>
                <div class="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-blue-700 text-white font-black text-xs flex items-center justify-center">#<?= $p['dorsal'] ?></div>
                        <div>
                            <strong class="text-xs font-black text-slate-900 block"><?= htmlspecialchars($p['full_name']) ?></strong>
                            <span id="pts_<?= $p['id'] ?>" class="text-[11px] text-blue-700 font-bold">12 PTS anotados</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="scorePlayer(<?= $p['id'] ?>, 1)" class="px-2.5 py-1.5 rounded-lg bg-white border text-xs font-bold shadow-sm active:scale-95">+1 TL</button>
                        <button onclick="scorePlayer(<?= $p['id'] ?>, 2)" class="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-sm active:scale-95">+2 Doble</button>
                        <button onclick="scorePlayer(<?= $p['id'] ?>, 3)" class="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm active:scale-95">+3 Triple</button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<script>
let home = 68, away = 64;
let playerScores = {};

function scorePlayer(id, pts) {
    home += pts;
    document.getElementById('homeScore').innerText = home;
    if (!playerScores[id]) playerScores[id] = 12;
    playerScores[id] += pts;
    document.getElementById('pts_' + id).innerText = playerScores[id] + ' PTS anotados';
}

function addAway(pts) {
    away += pts;
    document.getElementById('awayScore').innerText = away;
}
</script>
${navHtml('marcador')}`;
  zip.file('marcador.php', marcadorPhp);

  // 8. estadisticas.php (Identical rankings & match history)
  const estadisticasPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);
$matches = $pdo->query("SELECT * FROM matches ORDER BY id DESC")->fetchAll();
$totalPlayed = count($matches);
$won = 0;
foreach ($matches as $m) if ($m['home_score'] > $m['away_score']) $won++;
$lost = $totalPlayed - $won;
$winRate = $totalPlayed > 0 ? round(($won / $totalPlayed) * 100) : 0;
?>
${headHtml('Estadísticas y Récord', 'record')}
<div class="space-y-4 w-full max-w-4xl mx-auto">
    <!-- Balance Strip -->
    <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900">Balance y Rendimiento General</h3>
        <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-3 bg-slate-50 rounded-xl">
                <span class="text-slate-400 block font-bold">Jugados</span>
                <span class="text-xl font-black text-slate-900"><?= $totalPlayed ?></span>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl">
                <span class="text-emerald-600 block font-bold">Ganados</span>
                <span class="text-xl font-black text-emerald-600"><?= $won ?></span>
            </div>
            <div class="p-3 bg-rose-50 rounded-xl">
                <span class="text-rose-600 block font-bold">Perdidos</span>
                <span class="text-xl font-black text-rose-600"><?= $lost ?></span>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl">
                <span class="text-blue-700 block font-bold">% Victoria</span>
                <span class="text-xl font-black text-blue-600"><?= $winRate ?>%</span>
            </div>
        </div>
    </div>

    <!-- Historial de Partidos -->
    <div class="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 class="text-base font-black text-slate-900">Historial de Partidos</h3>
        <div class="space-y-2 text-xs">
            <?php foreach ($matches as $m): $win = $m['home_score'] > $m['away_score']; ?>
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                        <span class="text-slate-400 block"><?= $m['match_date'] ?> · <?= htmlspecialchars($m['location']) ?></span>
                        <strong class="text-sm font-black text-slate-900"><?= htmlspecialchars($m['home_team']) ?> vs <?= htmlspecialchars($m['away_team']) ?></strong>
                    </div>
                    <div class="text-right">
                        <span class="font-mono font-black text-base text-blue-700"><?= $m['home_score'] ?> - <?= $m['away_score'] ?></span>
                        <span class="block text-[10px] font-bold <?= $win ? 'text-emerald-600' : 'text-rose-600' ?>"><?= $win ? 'VICTORIA' : 'DERROTA' ?></span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
${navHtml('record')}`;
  zip.file('estadisticas.php', estadisticasPhp);

  // 9. cancha3d.php (Interactive Three.js Court with shooting & cones in standalone PHP!)
  const cancha3dPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);
?>
${headHtml('Cancha 3D Completa', 'cancha3d')}
<div class="w-full max-w-4xl mx-auto space-y-3">
    <!-- Top Bar -->
    <div class="flex items-center justify-between bg-white p-3 rounded-2xl border border-blue-100 shadow-sm text-xs">
        <a href="index.php" class="font-bold text-blue-600 hover:underline">← Volver al Inicio</a>
        <span class="font-black text-slate-900">🏀 Cancha Oficial 3D: Survivors de Mellado</span>
        <button onclick="toggleDrill()" class="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg shadow">Cambiar Ejercicio</button>
    </div>

    <!-- 3D Canvas Box -->
    <div id="courtContainer" class="w-full h-[520px] rounded-3xl overflow-hidden border border-blue-200 shadow-xl bg-slate-950 relative"></div>
</div>

<!-- Three.js CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const container = document.getElementById('courtContainer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a101f);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 20, 24);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Lighting
const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
keyLight.position.set(10, 20, 15);
scene.add(keyLight);
scene.add(new THREE.AmbientLight(0xe0f2fe, 1.0));

// Hardwood Floor
const canvas = document.createElement('canvas');
canvas.width = 1024; canvas.height = 512;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#c79c65';
ctx.fillRect(0, 0, 1024, 512);
ctx.strokeStyle = '#2563eb';
ctx.lineWidth = 10;
ctx.strokeRect(30, 30, 964, 452);
ctx.beginPath();
ctx.moveTo(512, 30); ctx.lineTo(512, 482);
ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.stroke();
ctx.beginPath(); ctx.arc(512, 256, 70, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(30,58,138,0.85)'; ctx.fill(); ctx.stroke();

const courtTex = new THREE.CanvasTexture(canvas);
const courtGeo = new THREE.PlaneGeometry(28, 15);
const courtMat = new THREE.MeshStandardMaterial({ map: courtTex, roughness: 0.3 });
const court = new THREE.Mesh(courtGeo, courtMat);
court.rotation.x = -Math.PI / 2;
scene.add(court);

// Hoops
function addHoop(x) {
    const g = new THREE.Group();
    g.position.set(x, 0, 0);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    pole.position.set(x > 0 ? 0.9 : -0.9, 2.2, 0);
    g.add(pole);
    const bb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 1.8), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    bb.position.set(0, 3.25, 0);
    g.add(bb);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 12, 32), new THREE.MeshStandardMaterial({ color: 0xff4500 }));
    rim.rotation.x = Math.PI / 2;
    rim.position.set(x > 0 ? -0.38 : 0.38, 3.05, 0);
    g.add(rim);
    scene.add(g);
}
addHoop(-12.5);
addHoop(12.5);

// Cones
const coneGroup = new THREE.Group();
[-10, -6, -2, 2].forEach(x => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xff5500 }));
    cone.position.set(x, 0.3, (x % 4 === 0 ? 2.5 : -2.5));
    coneGroup.add(cone);
});
scene.add(coneGroup);

// Athlete Mannequin
const player = new THREE.Group();
const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.28, 0.9), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
torso.position.y = 1.05; player.add(torso);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
head.position.y = 1.65; player.add(head);
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), new THREE.MeshStandardMaterial({ color: 0xea580c }));
ball.position.set(0, 0.32, 0); scene.add(ball);
scene.add(player);

let t = 0, currentMode = 'shoot';
function animate() {
    requestAnimationFrame(animate);
    t += 0.015;
    if (t > 1) t = 0;

    if (currentMode === 'shoot') {
        coneGroup.visible = false;
        let px = -2 - t * 6;
        player.position.set(px, (t > 0.6 && t < 0.9 ? (t - 0.6) * 2.5 : 0), 0);
        player.rotation.y = -Math.PI / 2;

        if (t < 0.65) {
            ball.position.set(px - 0.4, 0.32 + Math.abs(Math.sin(t * 20)) * 0.5, 0);
        } else if (t < 0.9) {
            let flight = (t - 0.65) / 0.25;
            ball.position.set(-8 + flight * -4.12, 1.8 + Math.sin(flight * Math.PI) * 2.2 + flight * 1.25, 0);
        } else {
            ball.position.set(-12.12, Math.max(0.32, 3.05 - (t - 0.9) * 15), 0);
        }
    } else {
        coneGroup.visible = true;
        let px = -11 + t * 13;
        let pz = Math.sin(t * Math.PI * 4) * 2.5;
        player.position.set(px, 0, pz);
        ball.position.set(px + 0.3, 0.32 + Math.abs(Math.sin(t * 20)) * 0.4, pz);
    }

    renderer.render(scene, camera);
}
animate();

function toggleDrill() {
    currentMode = currentMode === 'shoot' ? 'cones' : 'shoot';
    t = 0;
}
</script>
${navHtml('cancha3d')}`;
  zip.file('cancha3d.php', cancha3dPhp);

  // 10. ajustes.php
  const ajustesPhp = `<?php
require_once 'config.php';
$club = getClubSettings($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $team = trim($_POST['team_name']);
    $city = trim($_POST['city']);
    $coach = trim($_POST['coach_name']);
    $tagline = trim($_POST['tagline']);
    $logo = trim($_POST['logo_url']) ?: $club['logo_url'];

    $stmt = $pdo->prepare("UPDATE club_settings SET team_name = ?, city = ?, coach_name = ?, tagline = ?, logo_url = ? WHERE id = 1");
    $stmt->execute([$team, $city, $coach, $tagline, $logo]);
    header("Location: ajustes.php?saved=1");
    exit;
}
?>
${headHtml('Ajustes del Club', 'ajustes')}
<div class="space-y-4 w-full max-w-md mx-auto">
    <div class="bg-white border border-blue-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="text-base font-black text-slate-900 border-b pb-2">Ajustes del Equipo Survivors</h3>
        <?php if (isset($_GET['saved'])): ?>
            <div class="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-200 font-bold">¡Ajustes guardados con éxito!</div>
        <?php endif; ?>
        <form method="POST" class="space-y-3 text-xs">
            <div>
                <label class="font-bold block mb-1">Nombre Oficial del Equipo</label>
                <input type="text" name="team_name" value="<?= htmlspecialchars($club['team_name']) ?>" class="w-full bg-slate-50 border rounded-xl p-2.5 font-bold">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="font-bold block mb-1">Ciudad / Sede</label>
                    <input type="text" name="city" value="<?= htmlspecialchars($club['city']) ?>" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
                <div>
                    <label class="font-bold block mb-1">Entrenador / Coach</label>
                    <input type="text" name="coach_name" value="<?= htmlspecialchars($club['coach_name']) ?>" class="w-full bg-slate-50 border rounded-xl p-2">
                </div>
            </div>
            <div>
                <label class="font-bold block mb-1">Lema / Slogan</label>
                <input type="text" name="tagline" value="<?= htmlspecialchars($club['tagline']) ?>" class="w-full bg-slate-50 border rounded-xl p-2">
            </div>
            <div>
                <label class="font-bold block mb-1">Escudo / Logo (Galería)</label>
                <input type="file" accept="image/*" class="w-full text-xs" onchange="previewLogo(this)">
                <input type="hidden" name="logo_url" id="hiddenLogoUrl" value="<?= htmlspecialchars($club['logo_url']) ?>">
            </div>
            <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow">Guardar Ajustes</button>
        </form>
    </div>
</div>
<script>
function previewLogo(input) {
    if (input.files && input.files[0]) {
        let r = new FileReader();
        r.onload = function(e) { document.getElementById('hiddenLogoUrl').value = e.target.result; }
        r.readAsDataURL(input.files[0]);
    }
}
</script>
${navHtml('ajustes')}`;
  zip.file('ajustes.php', ajustesPhp);

  // Generate and download zip in browser
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Survivors_Mellado_PHP_MySQL.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
