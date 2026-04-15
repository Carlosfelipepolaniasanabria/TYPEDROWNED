// ===================================================
//  storage.js — Manejo de Progreso de TypeQuest
//  SIN BACKEND: todo se guarda en localStorage
//
//  CÓMO FUNCIONA:
//  - El progreso de cada usuario se guarda como un objeto en localStorage
//  - La clave en localStorage es: 'tq_progress_{userId}'
//  - Los usuarios invitados NO tienen progreso persistente
//    (usan sessionStorage temporal que se borra al cerrar pestaña)
//
//  ESTRUCTURA DE PROGRESO:
//  {
//    userId: string,
//    levels: {
//      nivel1: { maxSublevel: number, bestWpm: number, bestAcc: number },
//      nivel2: { maxSublevel: number, bestWpm: number, bestAcc: number },
//      nivel3: { maxSublevel: number, bestWpm: number, bestAcc: number },
//    }
//  }
//
//  IMPORTANTE:
//  - El array `progress` en memoria se reinicia al recargar
//  - Sin localStorage, el progreso se pierde al cerrar el navegador
// ===================================================

// ── Prefijo de clave en localStorage para el progreso ──
const PROGRESS_PREFIX = 'tq_progress_';

// ── Clave especial para invitados en sessionStorage ──
const GUEST_SESSION_KEY = 'tq_guest_progress';

// ── Array en memoria con todos los registros de progreso cargados ──
// NOTA: Este array se vacía al recargar si no se usa localStorage
let progress = [];

/**
 * Obtiene la clave de localStorage para un usuario dado
 * @param {string} userId
 * @returns {string}
 */
function getProgressKey(userId) {
  return PROGRESS_PREFIX + userId;
}

/**
 * Crea un objeto de progreso vacío para un usuario
 * @param {string} userId
 * @returns {object}
 */
function createEmptyProgress(userId) {
  return {
    userId,
    levels: {
      nivel1: { maxSublevel: 1, bestWpm: 0, bestAcc: 0 },
      nivel2: { maxSublevel: 1, bestWpm: 0, bestAcc: 0 },
      nivel3: { maxSublevel: 1, bestWpm: 0, bestAcc: 0 },
    }
  };
}

/**
 * Carga el progreso de un usuario desde localStorage
 * Si no existe, crea uno vacío y lo guarda
 * @param {string} userId - ID del usuario
 * @returns {object} - Objeto de progreso
 */
function loadProgress(userId) {
  const key = getProgressKey(userId);
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Agregar al array en memoria si no está ya
      const idx = progress.findIndex(p => p.userId === userId);
      if (idx === -1) progress.push(parsed);
      else progress[idx] = parsed;
      return parsed;
    } catch (e) {
      // Si hay error, crear progreso vacío
    }
  }

  // No existe: crear vacío y persistir
  const empty = createEmptyProgress(userId);
  progress.push(empty);
  localStorage.setItem(key, JSON.stringify(empty));
  return empty;
}

/**
 * Guarda el progreso de un usuario en localStorage
 * @param {string} userId
 * @param {object} data - Objeto de progreso actualizado
 */
function saveProgress(userId, data) {
  const key = getProgressKey(userId);
  localStorage.setItem(key, JSON.stringify(data));

  // Actualizar también el array en memoria
  const idx = progress.findIndex(p => p.userId === userId);
  if (idx === -1) progress.push(data);
  else progress[idx] = data;
}

/**
 * Actualiza el progreso después de completar un subnivel
 * Solo guarda si el nuevo resultado mejora el anterior
 * @param {string} userId    - ID del usuario (o 'guest' para invitados)
 * @param {string} levelKey  - 'nivel1', 'nivel2' o 'nivel3'
 * @param {number} sublevel  - Número del subnivel completado
 * @param {number} wpm       - Palabras por minuto obtenidas
 * @param {number} acc       - Precisión en porcentaje
 */
function updateProgress(userId, levelKey, sublevel, wpm, acc) {
  // Los invitados usan sessionStorage (se borra al cerrar pestaña)
  if (userId === 'guest') {
    updateGuestProgress(levelKey, sublevel, wpm, acc);
    return;
  }

  // Cargar progreso actual del usuario registrado
  const data = loadProgress(userId);

  // Asegurarse de que el nivel existe en el objeto
  if (!data.levels[levelKey]) {
    data.levels[levelKey] = { maxSublevel: 1, bestWpm: 0, bestAcc: 0 };
  }

  const levelData = data.levels[levelKey];

  // Actualizar máximo subnivel desbloqueado
  if (sublevel + 1 > levelData.maxSublevel) {
    levelData.maxSublevel = Math.min(sublevel + 1, 20); // Máximo 20 subniveles
  }

  // Guardar mejor WPM
  if (wpm > levelData.bestWpm) levelData.bestWpm = wpm;

  // Guardar mejor precisión
  if (acc > levelData.bestAcc) levelData.bestAcc = acc;

  // Persistir cambios
  saveProgress(userId, data);

  // También actualizar las claves legacy que usan nivel1.js, nivel2.js, nivel3.js
  // para que los niveles ya construidos sigan funcionando
  syncLegacyKeys(levelKey, levelData.maxSublevel);
}

/**
 * Sincroniza con las claves legacy que usan los archivos de nivel
 * nivel1.js usa sessionStorage('subsuelo_unlocked')
 * nivel2.js usa localStorage('n2_max')
 * nivel3.js usa localStorage('n3_max')
 * @param {string} levelKey
 * @param {number} maxSublevel
 */
function syncLegacyKeys(levelKey, maxSublevel) {
  if (levelKey === 'nivel1') {
    sessionStorage.setItem('subsuelo_unlocked', maxSublevel);
  } else if (levelKey === 'nivel2') {
    localStorage.setItem('n2_max', maxSublevel);
  } else if (levelKey === 'nivel3') {
    localStorage.setItem('n3_max', maxSublevel);
  }
}

/**
 * Maneja el progreso de usuarios invitados usando sessionStorage
 * Este progreso se pierde al cerrar la pestaña (comportamiento esperado)
 */
function updateGuestProgress(levelKey, sublevel, wpm, acc) {
  let guestData;
  try {
    guestData = JSON.parse(sessionStorage.getItem(GUEST_SESSION_KEY)) || createEmptyProgress('guest');
  } catch (e) {
    guestData = createEmptyProgress('guest');
  }

  if (!guestData.levels[levelKey]) {
    guestData.levels[levelKey] = { maxSublevel: 1, bestWpm: 0, bestAcc: 0 };
  }

  const levelData = guestData.levels[levelKey];
  if (sublevel + 1 > levelData.maxSublevel) levelData.maxSublevel = Math.min(sublevel + 1, 20);
  if (wpm > levelData.bestWpm) levelData.bestWpm = wpm;
  if (acc > levelData.bestAcc) levelData.bestAcc = acc;

  sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestData));
  syncLegacyKeys(levelKey, levelData.maxSublevel);
}

/**
 * Obtiene el progreso de un usuario
 * @param {string} userId - 'guest' o ID real
 * @returns {object}
 */
function getProgress(userId) {
  if (userId === 'guest') {
    try {
      return JSON.parse(sessionStorage.getItem(GUEST_SESSION_KEY)) || createEmptyProgress('guest');
    } catch (e) {
      return createEmptyProgress('guest');
    }
  }
  return loadProgress(userId);
}

/**
 * Reinicia el progreso de un usuario en un nivel específico
 * Útil para depuración o si el usuario quiere empezar de nuevo
 * @param {string} userId
 * @param {string} levelKey
 */
function resetLevelProgress(userId, levelKey) {
  if (userId === 'guest') return;
  const data = loadProgress(userId);
  data.levels[levelKey] = { maxSublevel: 1, bestWpm: 0, bestAcc: 0 };
  saveProgress(userId, data);
}