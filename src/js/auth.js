// ===================================================
//  auth.js — Sistema de Autenticación de TypeQuest
//  SIN BACKEND: todo se maneja con localStorage
//
//  CÓMO FUNCIONA:
//  - Los usuarios se guardan como un array de objetos en localStorage
//  - Al registrarse, se agrega un nuevo objeto al array y se persiste
//  - Al iniciar sesión, se busca el usuario y se valida la contraseña
//  - El usuario activo se guarda en localStorage como 'tq_current_user'
//
//  IMPORTANTE:
//  - El array `users` en memoria se reinicia al recargar la página
//  - Para persistencia real, SIEMPRE se usa localStorage
//  - Sin localStorage, el progreso y los usuarios se perderían
// ===================================================

// ── Clave usada para guardar el array de usuarios en localStorage ──
const AUTH_STORAGE_KEY = 'tq_users';

// ── Clave para el usuario activo en sesión ──
const CURRENT_USER_KEY = 'tq_current_user';

// ── Array en memoria (se carga desde localStorage al iniciar) ──
// NOTA: Si no se usa localStorage, este array se vacía al recargar
let users = [];

// ── Cargar usuarios desde localStorage al iniciar el módulo ──
(function init() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      users = JSON.parse(stored); // Recuperar array guardado
    } catch (e) {
      users = []; // Si hay error de parseo, empezar vacío
    }
  }
})();

/**
 * Guarda el array de usuarios en localStorage
 * Se llama después de cada registro o modificación
 */
function persistUsers() {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Registra un nuevo usuario
 * @param {string} username - Nombre de usuario (único)
 * @param {string} password - Contraseña del usuario
 * @returns {{ success: boolean, message: string }}
 */
function registerUser(username, password) {
  // Validar que los campos no estén vacíos
  if (!username || !password) {
    return { success: false, message: 'Completa todos los campos.' };
  }

  // El nombre de usuario debe tener al menos 3 caracteres
  if (username.trim().length < 3) {
    return { success: false, message: 'El usuario debe tener al menos 3 caracteres.' };
  }

  // La contraseña debe tener al menos 4 caracteres
  if (password.length < 4) {
    return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  // Verificar si el nombre de usuario ya existe (case-insensitive)
  const exists = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (exists) {
    return { success: false, message: 'Ese nombre de usuario ya está registrado.' };
  }

  // Crear el nuevo objeto de usuario
  const newUser = {
    id: Date.now().toString(),         // ID único basado en timestamp
    username: username.trim(),         // Nombre limpio sin espacios extra
    password: password,                // En producción real esto debería hashearse
    createdAt: new Date().toISOString(), // Fecha de registro
  };

  // Agregar al array en memoria
  users.push(newUser);

  // Persistir en localStorage
  persistUsers();

  return { success: true, message: '¡Registro exitoso! Ahora puedes iniciar sesión.' };
}

/**
 * Inicia sesión con usuario y contraseña
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {{ success: boolean, message: string, user?: object }}
 */
function loginUser(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Completa todos los campos.' };
  }

  // Buscar usuario en el array (case-insensitive)
  const user = users.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase()
       && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Usuario o contraseña incorrectos.' };
  }

  // Guardar usuario activo en localStorage (solo datos públicos, sin contraseña)
  const sessionUser = { id: user.id, username: user.username };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));

  return { success: true, message: `¡Bienvenido, ${user.username}!`, user: sessionUser };
}

/**
 * Cierra la sesión del usuario actual
 * Elimina el usuario activo de localStorage
 */
function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Obtiene el usuario actualmente logueado
 * @returns {object|null} - El usuario activo o null si es invitado
 */
function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

/**
 * Verifica si hay un usuario logueado
 * @returns {boolean}
 */
function isLoggedIn() {
  return getCurrentUser() !== null;
}