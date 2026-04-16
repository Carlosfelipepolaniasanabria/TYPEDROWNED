// ===================================================
//  nivel1_new.js — Nivel 1 CON MECÁNICAS NUEVAS
//
//  Archivo principal del Nivel 1 del juego de mecanografía.
//  Estructura general:
//    1. AMBIENTES      → Configuración visual de los 3 entornos del juego
//    2. SistemaVidas   → Clase que gestiona las 4 vidas del jugador
//    3. Personaje      → Clase que renderiza y anima al personaje HTML
//    4. BanderaColombia→ Overlay animado de celebración al completar subnivel
//    5. Canciones      → Textos largos usados en subniveles 10 y 20
//    6. Frases         → Array con los 20 textos que el jugador debe tipear
//    7. Desbloqueo     → Persistencia en localStorage del progreso
//    8. Preload        → Escena Phaser que precarga los audios
//    9. LevelSelect    → Escena Phaser del selector de subniveles (grid 4×5)
//   10. PlayGame       → Escena Phaser principal: tipeado, timer, vidas
//   11. ResultScreen   → Escena Phaser de resultados al terminar/fallar
// ===================================================


// ===================================================
//  SECCIÓN 1: DEFINICIÓN DE AMBIENTES
//  Cada ambiente es un objeto con paleta de colores para
//  el fondo, muros, suelo, cielo, etiqueta y estrella.
//  Se aplica progresivamente según el subnivel activo.
// ===================================================
const AMBIENTES = {

  // SUBSUELO: tonos marrones y anaranjados oscuros.
  // Se usa en los subniveles del 1 al 7.
  subsuelo: {
    bgColor:    0x1a0a00,   // Color de fondo principal (marrón muy oscuro)
    wallColor:  0x3a1a00,   // Color de paredes/muros
    groundColor:0x2d1000,   // Color del suelo
    skyColor:   0x0a0500,   // Color del cielo (casi negro)
    label:      'SUBSUELO', // Texto identificador del ambiente
    labelColor: '#e8a060',  // Color del texto identificador (naranja cálido)
    starColor:  0x885522,   // Color de las estrellas de fondo
    groundLine: '#5a2d00',  // Color de la línea del suelo
  },

  // SUPERFICIE: tonos verdes y azulados.
  // Se usa en los subniveles del 8 al 14.
  superficie: {
    bgColor:    0x0a1a00,
    wallColor:  0x1a3a00,
    groundColor:0x2d5500,
    skyColor:   0x0a2a3a,
    label:      'SUPERFICIE',
    labelColor: '#7ecf5a',  // Verde claro
    starColor:  0x44aa66,
    groundLine: '#2a7a00',
  },

  // ESPACIO: tonos azules muy oscuros, casi negros.
  // Se usa en los subniveles del 15 al 20.
  espacio: {
    bgColor:    0x00001a,
    wallColor:  0x0a0a3a,
    groundColor:0x050520,
    skyColor:   0x000010,
    label:      'ESPACIO',
    labelColor: '#a0a8ff',  // Azul lila
    starColor:  0x6666ff,
    groundLine: '#2a2a8a',
  },
};

/**
 * getAmbiente(sublevel)
 * ---------------------
 * Función utilitaria que recibe el número de subnivel (1–20)
 * y devuelve el objeto de ambiente correspondiente de AMBIENTES.
 *
 *   Subniveles  1–7  → AMBIENTES.subsuelo
 *   Subniveles  8–14 → AMBIENTES.superficie
 *   Subniveles 15–20 → AMBIENTES.espacio
 *
 * @param {number} sublevel - Número de subnivel activo
 * @returns {object} Objeto de configuración visual del ambiente
 */
function getAmbiente(sublevel) {
  if (sublevel <= 7)  return AMBIENTES.subsuelo;
  if (sublevel <= 14) return AMBIENTES.superficie;
  return AMBIENTES.espacio;
}


// ===================================================
//  SECCIÓN 2: MÓDULO DE VIDAS
//
//  Gestiona el sistema de 4 corazones del jugador.
//  Los corazones se renderizan como texto emoji (❤️/🖤)
//  directamente sobre el canvas de Phaser mediante
//  this.scene.add.text(), lo que los posiciona encima
//  del fondo pero debajo del overlay HTML.
// ===================================================
class SistemaVidas {

  /**
   * @param {Phaser.Scene} scene   - Escena Phaser activa (PlayGame)
   * @param {number}       maxVidas- Número máximo de vidas (por defecto 4)
   */
  constructor(scene, maxVidas = 4) {
    this.scene     = scene;
    this.maxVidas  = maxVidas;
    this.vidas     = maxVidas;    // Contador de vidas restantes
    this.corazones = [];          // Array de objetos Text de Phaser
    this.bloqueado = false;       // Flag para evitar pérdidas múltiples simultáneas
  }

  /**
   * crear(x, y)
   * -----------
   * Instancia los corazones en pantalla separados 32px entre sí.
   * Cada corazón es un objeto Text de Phaser con depth=20 para
   * que aparezca sobre casi todo el contenido de la escena.
   *
   * @param {number} x - Posición X del primer corazón
   * @param {number} y - Posición Y del primer corazón
   */
  crear(x, y) {
    for (let i = 0; i < this.maxVidas; i++) {
      const corazon = this.scene.add.text(x + i * 32, y, '❤️', {
        fontSize: '22px'
      }).setDepth(20);
      this.corazones.push(corazon);
    }
  }

  /**
   * perderVida(onMuerte)
   * --------------------
   * Descuenta una vida y actualiza el emoji del corazón perdido.
   * Usa un flag `bloqueado` para ignorar llamadas durante los
   * 600 ms de animación de daño, evitando pérdidas en cadena.
   * Si el contador llega a 0, ejecuta el callback `onMuerte`
   * luego de los 600 ms de gracia.
   *
   * @param {Function} onMuerte - Callback que se llama al quedarse sin vidas
   */
  perderVida(onMuerte) {
    if (this.bloqueado || this.vidas <= 0) return; // Evita pérdidas múltiples
    this.bloqueado = true;
    this.vidas--;

    // Cambia el emoji del corazón perdido a corazón negro
    if (this.corazones[this.vidas]) {
      this.corazones[this.vidas].setText('🖤');
    }

    // Espera 600 ms antes de desbloquear y comprobar game over
    this.scene.time.delayedCall(600, () => {
      this.bloqueado = false;
      if (this.vidas <= 0 && onMuerte) onMuerte(); // Dispara pantalla de derrota
    });
  }

  /**
   * sinVidas()
   * ----------
   * Consulta rápida del estado de vidas.
   * @returns {boolean} true si no quedan vidas
   */
  sinVidas() { return this.vidas <= 0; }

  /**
   * destruir()
   * ----------
   * Elimina todos los objetos Text de corazones de la escena Phaser.
   * Se llama desde PlayGame._cleanup() al cambiar de escena.
   */
  destruir() {
    this.corazones.forEach(c => c.destroy());
    this.corazones = [];
  }
}


// ===================================================
//  SECCIÓN 3: MÓDULO DE PERSONAJE
//
//  Crea y anima un personaje humano SVG renderizado
//  como elemento HTML fijo sobre el canvas del juego.
//  El personaje tiene 4 estados posibles:
//    • idle     → animación de respiración suave en bucle
//    • walking  → animación de caminata de brazos y piernas
//    • hurt     → temblor con flash rojo y retroceso
//    • victoria → salto con brillo verde
//
//  El outfit (colores de ropa) cambia según el ambiente:
//    • subsuelo  → tonos terracota/crema
//    • superficie→ tonos verdes
//    • espacio   → tonos azul/lila
// ===================================================
class Personaje {

  /**
   * @param {Phaser.Scene} scene   - Escena Phaser activa
   * @param {object}       ambiente- Objeto de ambiente (de AMBIENTES)
   */
  constructor(scene, ambiente) {
    this.scene     = scene;
    this.ambiente  = ambiente;
    this.el        = null;       // Referencia al div contenedor (mismo que container)
    this.container = null;       // Div raíz del personaje en el DOM
    this.svg       = null;       // Elemento <svg> interno del personaje
    this.estado    = 'idle';     // Estado de animación actual
    this.x         = 60;        // Posición X actual del personaje (px desde la izquierda)
    this.maxX      = 320;       // Límite derecho máximo de movimiento
    this.minX      = 30;        // Límite izquierdo mínimo (para retroceso al recibir daño)
    this.dañado    = false;     // Flag de invulnerabilidad temporal tras daño
    this._crearEstilos();        // Inyecta el bloque <style> de animaciones CSS
    this._crearElemento();       // Crea el DOM (div + SVG) y lo añade al body
  }

  /**
   * _crearEstilos()
   * ---------------
   * Inyecta una hoja de estilos CSS en el <head> del documento.
   * Solo se inyecta una vez (comprueba el id 'personaje-humano-styles').
   *
   * Contiene:
   *  - .personaje-wrap       : posicionamiento fijo en la esquina inferior izquierda
   *  - .personaje-shadow     : sombra elíptica difuminada bajo los pies
   *  - .personaje-svg        : dimensiones y transform-origin del SVG
   *  - @keyframes respirar   : animación idle (ligero sube-baja + escala)
   *  - .walking + @keyframes : animaciones de caminata para torso, cabeza, brazos y piernas
   *  - .hurt + @keyframes    : sacudida rápida + drop-shadow rojo al recibir daño
   *  - .hurt-wrap            : inclina y desplaza el contenedor durante el daño
   *  - .victoria + @keyframes: salto infinito con drop-shadow verde
   *  - .personaje-exclamacion: emoji flotante que sube y desaparece
   */
  _crearEstilos() {
    if (document.getElementById('personaje-humano-styles')) return;
    const style = document.createElement('style');
    style.id = 'personaje-humano-styles';
    style.textContent = `
      /* Contenedor fijo del personaje, alineado en la esquina inferior izquierda */
      .personaje-wrap {
        position: fixed; bottom: 48px; left: 60px;
        z-index: 15; pointer-events: none;
        width: 90px; height: 150px;
        display: flex; align-items: flex-end; justify-content: center;
        transition: left 0.18s ease-out, transform 0.18s ease-out;
      }
      /* Sombra difuminada bajo los pies del personaje */
      .personaje-shadow {
        position: absolute; bottom: 6px;
        width: 42px; height: 10px; border-radius: 50%;
        background: rgba(0,0,0,0.35); filter: blur(2px); transform: translateX(-2px);
      }
      /* SVG con transform-origin en la base para animaciones naturales */
      .personaje-svg {
        width: 78px; height: 138px;
        overflow: visible; transform-origin: center bottom;
      }
      /* Estado IDLE: pequeña oscilación vertical (efecto de respiración) */
      .personaje-svg.idle {
        animation: respirar 1.8s ease-in-out infinite;
      }
      @keyframes respirar {
        0%   { transform: translateY(0px) scaleY(1); }
        50%  { transform: translateY(-1px) scaleY(1.01); }
        100% { transform: translateY(0px) scaleY(1); }
      }
      /* Estado WALKING: anima torso, cabeza, brazos y piernas en alternado */
      .personaje-svg.walking .torso {
        animation: torsoWalk 0.34s ease-in-out infinite alternate;
        transform-origin: center 58px;
      }
      .personaje-svg.walking .arm-left {
        animation: armLeftWalk 0.34s ease-in-out infinite alternate;
        transform-origin: 28px 58px;
      }
      .personaje-svg.walking .arm-right {
        animation: armRightWalk 0.34s ease-in-out infinite alternate;
        transform-origin: 48px 58px;
      }
      .personaje-svg.walking .leg-left {
        animation: legLeftWalk 0.34s ease-in-out infinite alternate;
        transform-origin: 35px 88px;
      }
      .personaje-svg.walking .leg-right {
        animation: legRightWalk 0.34s ease-in-out infinite alternate;
        transform-origin: 41px 88px;
      }
      .personaje-svg.walking .head-group {
        animation: headWalk 0.34s ease-in-out infinite alternate;
        transform-origin: center 26px;
      }
      @keyframes torsoWalk {
        0%   { transform: translateY(0px) rotate(-1deg); }
        100% { transform: translateY(-2px) rotate(1deg); }
      }
      @keyframes headWalk {
        0%   { transform: translateY(0px); }
        100% { transform: translateY(-2px); }
      }
      @keyframes armLeftWalk {
        0%   { transform: rotate(24deg); }
        100% { transform: rotate(-18deg); }
      }
      @keyframes armRightWalk {
        0%   { transform: rotate(-18deg); }
        100% { transform: rotate(24deg); }
      }
      @keyframes legLeftWalk {
        0%   { transform: rotate(20deg); }
        100% { transform: rotate(-16deg); }
      }
      @keyframes legRightWalk {
        0%   { transform: rotate(-16deg); }
        100% { transform: rotate(20deg); }
      }
      /* Estado HURT: sacudida rápida + drop-shadow rojo + clase auxiliar en el wrap */
      .personaje-svg.hurt {
        animation: hurtShake 0.45s ease;
        filter: drop-shadow(0 0 10px rgba(255,60,60,0.9));
      }
      .personaje-wrap.hurt-wrap {
        transform: translateX(-10px) rotate(-8deg);
      }
      @keyframes hurtShake {
        0%   { transform: translateX(0px) rotate(0deg); }
        20%  { transform: translateX(-5px) rotate(-6deg); }
        40%  { transform: translateX(6px) rotate(6deg); }
        60%  { transform: translateX(-4px) rotate(-4deg); }
        80%  { transform: translateX(3px) rotate(3deg); }
        100% { transform: translateX(0px) rotate(0deg); }
      }
      /* Estado VICTORIA: salto bounce + drop-shadow verde */
      .personaje-svg.victoria {
        animation: victoryJump 0.6s ease-in-out infinite alternate;
        filter: drop-shadow(0 0 12px rgba(120,255,160,0.95));
      }
      @keyframes victoryJump {
        0%   { transform: translateY(0px) scale(1); }
        100% { transform: translateY(-12px) scale(1.04); }
      }
      /* Emoji flotante (🤕 al dañarse, ⭐ al ganar) que sube y se desvanece */
      .personaje-exclamacion {
        position: absolute; top: -26px; left: 50%;
        transform: translateX(-50%); font-size: 24px;
        opacity: 0; animation: flotarIcono 0.8s ease forwards;
        pointer-events: none;
      }
      @keyframes flotarIcono {
        0%   { opacity: 1; transform: translateX(-50%) translateY(0px) scale(0.9); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-22px) scale(1.12); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * _crearElemento()
   * ----------------
   * Construye el árbol DOM del personaje:
   *   div.personaje-wrap
   *     └─ div.personaje-shadow  (sombra en el suelo)
   *     └─ svg.personaje-svg#personaje-svg  (figura humana vectorial)
   *          ├─ g.head-group   (cabeza + cuello)
   *          ├─ g.torso        (cuerpo + pantalón)
   *          ├─ g.arm-left     (brazo izquierdo)
   *          ├─ g.arm-right    (brazo derecho)
   *          ├─ g.leg-left     (pierna izquierda + pie)
   *          └─ g.leg-right    (pierna derecha + pie)
   *
   * El outfit (colores) se elige según el ambiente pasado al constructor.
   * Se añade al document.body y se guarda referencia en this.container y this.svg.
   */
  _crearElemento() {
    this.container = document.createElement('div');
    this.container.className = 'personaje-wrap';
    this.container.id = 'personaje-wrap';

    // Selección de colores de outfit según ambiente
    const outfit =
      this.ambiente === AMBIENTES.espacio
        ? { shirt: '#8fa2ff', pants: '#d9deff', skin: '#f0c7a8', shoe: '#cfd4ff' }  // Azul/lila
        : this.ambiente === AMBIENTES.superficie
        ? { shirt: '#66c46d', pants: '#d9f2da', skin: '#f0c7a8', shoe: '#b8ffb8' }  // Verde
        : { shirt: '#d88a55', pants: '#f2d3bd', skin: '#efc19c', shoe: '#e8b98c' }; // Terracota

    // SVG con grupos animables independientes para cada parte del cuerpo
    this.container.innerHTML = `
      <div class="personaje-shadow"></div>
      <svg class="personaje-svg idle" id="personaje-svg"
           viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg">
        <!-- CABEZA: elipse + pelo + ojos + boca + cuello -->
        <g class="head-group">
          <ellipse cx="40" cy="20" rx="12" ry="14" fill="${outfit.skin}" />
          <path d="M28 17 Q40 2 52 17 L52 13 Q40 -1 28 13 Z" fill="#2b1b14"/>
          <circle cx="36" cy="19" r="1.4" fill="#23150f"/>
          <circle cx="44" cy="19" r="1.4" fill="#23150f"/>
          <path d="M36 26 Q40 29 44 26" stroke="#7a3f32" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <rect x="37" y="33" width="6" height="5" rx="2" fill="${outfit.skin}" />
        </g>
        <!-- TORSO: cuerpo de la camisa + parte alta del pantalón -->
        <g class="torso">
          <path d="M28 40 Q40 34 52 40 L54 70 Q40 76 26 70 Z" fill="${outfit.shirt}" />
          <rect x="33" y="70" width="14" height="18" rx="5" fill="${outfit.pants}" />
        </g>
        <!-- BRAZO IZQUIERDO: rectángulo rotado + mano circular -->
        <g class="arm-left">
          <rect x="24" y="44" width="7" height="24" rx="4" fill="${outfit.skin}" transform="rotate(18 28 44)" />
          <circle cx="21" cy="68" r="3.5" fill="${outfit.skin}" />
        </g>
        <!-- BRAZO DERECHO: espejo del brazo izquierdo -->
        <g class="arm-right">
          <rect x="49" y="44" width="7" height="24" rx="4" fill="${outfit.skin}" transform="rotate(-18 52 44)" />
          <circle cx="59" cy="68" r="3.5" fill="${outfit.skin}" />
        </g>
        <!-- PIERNA IZQUIERDA: caña del pantalón + pie elíptico -->
        <g class="leg-left">
          <rect x="31" y="86" width="8" height="30" rx="4" fill="${outfit.pants}" />
          <ellipse cx="35" cy="119" rx="7" ry="3.8" fill="${outfit.shoe}" />
        </g>
        <!-- PIERNA DERECHA: espejo de la pierna izquierda -->
        <g class="leg-right">
          <rect x="41" y="86" width="8" height="30" rx="4" fill="${outfit.pants}" />
          <ellipse cx="45" cy="119" rx="7" ry="3.8" fill="${outfit.shoe}" />
        </g>
      </svg>
    `;

    document.body.appendChild(this.container);
    this.el  = this.container;                         // Alias de conveniencia
    this.svg = document.getElementById('personaje-svg');
    this._aplicarPosicion();                           // Pone la posición X inicial
  }

  /**
   * _aplicarPosicion()
   * ------------------
   * Sincroniza la propiedad CSS `left` del contenedor con this.x.
   * Al haber `transition: left 0.18s ease-out` en el CSS,
   * el movimiento se ve suavizado automáticamente.
   */
  _aplicarPosicion() {
    if (this.container) this.container.style.left = `${this.x}px`;
  }

  /**
   * _setEstado(nuevo)
   * -----------------
   * Limpia las clases de animación anteriores del SVG y aplica
   * la clase del nuevo estado ('idle' | 'walking' | 'hurt' | 'victoria').
   * Actualiza también this.estado para consultas externas.
   *
   * @param {string} nuevo - Nombre del nuevo estado de animación
   */
  _setEstado(nuevo) {
    if (!this.svg) return;
    this.svg.classList.remove('idle', 'walking', 'hurt', 'victoria');
    this.svg.classList.add(nuevo);
    this.estado = nuevo;
  }

  /**
   * idle()
   * ------
   * Activa la animación de respiración en reposo.
   * No hace nada si el personaje está en estado dañado.
   */
  idle() {
    if (this.dañado) return;
    this._setEstado('idle');
  }

  /**
   * caminarPaso()
   * -------------
   * Activa la animación de caminata, avanza 8 px hacia la derecha
   * (respetando maxX) y programa un retorno a idle tras 220 ms.
   * Se llama cada vez que el jugador teclea un carácter correcto.
   * No hace nada si el personaje está en estado dañado.
   */
  caminarPaso() {
    if (!this.svg || this.dañado) return;
    this._setEstado('walking');
    this.x = Math.min(this.maxX, this.x + 8); // Avanza 8 px sin superar maxX
    this._aplicarPosicion();
    clearTimeout(this._walkTimeout);
    // Vuelve a idle si no se recibe otro keypress en 220 ms
    this._walkTimeout = setTimeout(() => {
      if (!this.dañado) this.idle();
    }, 220);
  }

  /**
   * animarDaño()
   * ------------
   * Secuencia de daño de 500 ms:
   *   1. Activa animación 'hurt' (sacudida + drop-shadow rojo)
   *   2. Añade clase 'hurt-wrap' al contenedor (inclina el cuerpo)
   *   3. Retrocede 18 px hacia la izquierda (respetando minX)
   *   4. Muestra emoji 🤕 flotante durante 800 ms
   *   5. Tras 500 ms: limpia clases y reactiva idle
   *
   * El flag `dañado` bloquea el movimiento y nuevas animaciones
   * durante toda la secuencia.
   */
  animarDaño() {
    if (!this.svg || this.dañado) return;
    this.dañado = true;
    this._setEstado('hurt');
    this.container.classList.add('hurt-wrap');
    this.x = Math.max(this.minX, this.x - 18); // Retrocede 18 px sin bajar de minX
    this._aplicarPosicion();

    // Emoji flotante de dolor
    const exc = document.createElement('div');
    exc.className = 'personaje-exclamacion';
    exc.textContent = '🤕';
    this.container.appendChild(exc);
    setTimeout(() => exc.remove(), 800);

    // Limpieza de la animación de daño
    setTimeout(() => {
      if (this.container) this.container.classList.remove('hurt-wrap');
      if (this.svg) this.idle();
      this.dañado = false;
    }, 500);
  }

  /**
   * animarVictoria()
   * ----------------
   * Activa la animación de victoria (salto bounce + brillo verde)
   * y muestra el emoji ⭐ flotante.
   * Se llama cuando el jugador completa correctamente la frase.
   */
  animarVictoria() {
    if (!this.svg) return;
    this._setEstado('victoria');
    const exc = document.createElement('div');
    exc.className = 'personaje-exclamacion';
    exc.textContent = '⭐';
    this.container.appendChild(exc);
    setTimeout(() => exc.remove(), 800);
  }

  /**
   * destruir()
   * ----------
   * Cancela el timeout de caminata y elimina el contenedor del DOM.
   * Se llama desde PlayGame._cleanup() al abandonar la escena.
   */
  destruir() {
    clearTimeout(this._walkTimeout);
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}


// ===================================================
//  SECCIÓN 4: BANDERA DE COLOMBIA
//
//  Overlay de celebración que aparece al completar
//  cada subnivel. Muestra la bandera animada con el
//  número de subnivel completado y un mensaje patriótico.
//  Se auto-destruye tras `duracion` milisegundos.
// ===================================================
class BanderaColombia {
  constructor() {
    this.el = null; // Referencia al div overlay
    this._crearEstilos();
  }

  /**
   * _crearEstilos()
   * ---------------
   * Inyecta los estilos CSS de la bandera (una sola vez).
   *
   * Componentes visuales:
   *  - .bandera-overlay  : fondo semitransparente negro que cubre toda la pantalla
   *  - .bandera-colombia : rectángulo tricolor (40% amarillo / 30% azul / 30% rojo)
   *                        con efecto de ondeo mediante @keyframes ondeaBandera
   *  - .bandera-texto    : título "¡SUBNIVEL X COMPLETADO!" en dorado neón
   *  - .bandera-sub      : subtítulo "🇨🇴 ¡Colombia presente! 🇨🇴"
   *  - @keyframes fadeInBandera : entrada suave con scale desde 0.9 a 1
   */
  _crearEstilos() {
    if (document.getElementById('bandera-styles')) return;
    const style = document.createElement('style');
    style.id = 'bandera-styles';
    style.textContent = `
      /* Overlay de fondo oscuro semitransparente con entrada animada */
      .bandera-overlay {
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.72); z-index: 50;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        animation: fadeInBandera 0.4s ease; pointer-events: none;
      }
      @keyframes fadeInBandera {
        from { opacity: 0; transform: scale(0.9); }
        to   { opacity: 1; transform: scale(1); }
      }
      /* Bandera tricolor con efecto de ondeo suave */
      .bandera-colombia {
        width: 200px; height: 120px; border-radius: 6px;
        overflow: hidden; box-shadow: 0 0 40px rgba(255,220,0,0.5);
        display: flex; flex-direction: column; margin-bottom: 20px;
        animation: ondeaBandera 1s ease-in-out infinite alternate;
      }
      @keyframes ondeaBandera {
        0%   { transform: rotate(-2deg) scale(1); }
        100% { transform: rotate(2deg) scale(1.04); }
      }
      /* Franjas de la bandera: amarillo doble, azul, rojo */
      .bandera-amarillo { flex: 2; background: #FCD116; }
      .bandera-azul     { flex: 1; background: #003087; }
      .bandera-rojo     { flex: 1; background: #CE1126; }
      /* Texto principal del overlay */
      .bandera-texto {
        font-family: 'Courier New', monospace; font-size: 22px;
        font-weight: bold; color: #FFD700;
        text-shadow: 0 0 15px rgba(255,215,0,0.8);
        margin-top: 10px; letter-spacing: 3px;
      }
      /* Subtítulo con bandera emoji */
      .bandera-sub {
        font-family: 'Courier New', monospace;
        font-size: 14px; color: #aaa; margin-top: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * mostrar(sublevel, onDone, duracion)
   * ------------------------------------
   * Crea el overlay DOM, lo añade al body y lo destruye
   * automáticamente tras `duracion` ms, ejecutando el callback onDone.
   *
   * @param {number}   sublevel - Número del subnivel completado
   * @param {Function} onDone   - Callback ejecutado al cerrarse la bandera
   * @param {number}   duracion - Milisegundos de visualización (por defecto 2200 ms)
   */
  mostrar(sublevel, onDone, duracion = 2200) {
    this.el = document.createElement('div');
    this.el.className = 'bandera-overlay';
    this.el.innerHTML = `
      <div class="bandera-colombia">
        <div class="bandera-amarillo"></div>
        <div class="bandera-azul"></div>
        <div class="bandera-rojo"></div>
      </div>
      <div class="bandera-texto">¡SUBNIVEL ${sublevel} COMPLETADO!</div>
      <div class="bandera-sub">🇨🇴 ¡Colombia presente! 🇨🇴</div>
    `;
    document.body.appendChild(this.el);
    // Auto-cierre tras duracion ms
    setTimeout(() => { this.destruir(); if (onDone) onDone(); }, duracion);
  }

  /**
   * destruir()
   * ----------
   * Elimina el overlay del DOM de forma segura.
   */
  destruir() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
    }
  }
}


// ===================================================
//  SECCIÓN 5: CANCIONES
//
//  Textos completos de las dos canciones usadas en los
//  subniveles especiales 10 y 20. Estos subniveles tienen
//  tiempo extendido (240 s) y reproducen audio.
//  Los saltos de línea (\n) son luego normalizados
//  en PlayGame.init() reemplazándolos por espacios.
// ===================================================

// Canción del subnivel 10: "Saber querer" (tema del amor vs. querer)
const song_n1_10 = `Casi todos sabemos querer
Pero pocos sabemos amar
Es que amar y querer no es igual
Amar es sufrir, querer es gozar

El que ama pretende servir
El que ama, su vida la da
Y el que quiere pretende vivir
Y nunca sufrir, y nunca sufrir

El que ama no puede pensar
Todo lo da, todo lo da
El que quiere pretende olvidar
Y nunca llorar, y nunca llorar

El querer, pronto, puede acabar
El amor no conoce el final
Es que todos sabemos querer
Pero pocos sabemos amar`;

// Canción del subnivel 20: "Cohete en el pantalón" (tema melancólico/humorístico)
const song_n1_20 = `Hace frío y estoy lejos de casa
Hace tiempo que estoy sentado sobre esta piedra
Yo me pregunto
¿Para qué sirven las guerras?

Tengo un cohete en el pantalón
Vos estás tan fría, como la nieve a mi alrededor
Vos estás tan blanca
Y yo no sé qué hacer

La otra noche, te esperé bajo la lluvia dos horas
Mil horas, como un perro
Y cuando llegaste, me miraste y me dijiste: Loco
Estás mojado, ya no te quiero`;


// ===================================================
//  SECCIÓN 6: FRASES DE LOS 20 SUBNIVELES
//
//  Array indexado en 0 (words20[0] = subnivel 1).
//  Cada string es la frase/canción que el jugador
//  debe tipear para superar ese subnivel.
//  Los índices 9 y 19 (subniveles 10 y 20)
//  corresponden a los textos completos de las canciones.
// ===================================================
const words20 = [
  // Subnivel 1 — Subsuelo
  "me despierto en mi cueva y decido salir",
  // Subnivel 2 — Subsuelo
  "encuentro hongos brillantes y elijo los buenos para desayunar",
  // Subnivel 3 — Subsuelo
  "camino por el túnel oscuro con cuidado de no caer",
  // Subnivel 4 — Subsuelo
  "una araña gigante cuelga del techo y debo esquivarla rápido",
  // Subnivel 5 — Subsuelo
  "Cruzo el puente de huesos sin romper ni una sola tabla",
  // Subnivel 6 — Subsuelo
  "El charco negro es profundo así que busco un bote pequeño",
  // Subnivel 7 — Subsuelo
  "La rata es enorme pero la distraigo con un trozo de queso",
  // Subnivel 8 — Superficie
  "El río de lava brilla con furia y debo saltar con precisión",
  // Subnivel 9 — Superficie
  "Los murciélagos duermen arriba así que camino en silencio total",
  // Subnivel 10 — Superficie (¡CANCIÓN! 240 s + audio)
  song_n1_10,
  // Subnivel 11 — Superficie
  "El esqueleto guardián despierta y debo enfrentarlo con valentía",
  // Subnivel 12 — Superficie
  "Las pirañas atacan el bote y debo remar más rápido que sus dientes",
  // Subnivel 13 — Superficie
  "La corriente me jala con fuerza hacia la cascada pero no me rindo",
  // Subnivel 14 — Superficie
  "El hongo gigante es resbaladizo y escalo con cuidado para no caer",
  // Subnivel 15 — Espacio
  "Escorpión Tito me bloquea el paso con su cola venenosa y brillante",
  // Subnivel 16 — Espacio
  "Las alcantarillas huelen horrible pero son mi único camino hacia la ciudad",
  // Subnivel 17 — Espacio
  "El laberinto de tuberías no tiene fin y solo una lleva hacia arriba",
  // Subnivel 18 — Espacio
  "El agua sube rápido alguien jaló la cadena y debo escapar antes de ahogarme",
  // Subnivel 19 — Espacio
  "El Caimán Clásico abre sus fauces pero lo esquivo y subo la escalera",
  // Subnivel 20 — Espacio (¡CANCIÓN! 240 s + audio)
  song_n1_20
];


// ===================================================
//  SECCIÓN 7: SISTEMA DE DESBLOQUEO
//
//  Persiste el progreso del jugador en localStorage
//  con la clave 'subsuelo_unlocked'.
//  El valor representa el subnivel más alto habilitado
//  para jugar (empieza en 1 y sube hasta 20).
//  Solo se incrementa, nunca se decrementa.
// ===================================================

/**
 * getUnlockedLevel()
 * ------------------
 * Lee el nivel desbloqueado desde localStorage.
 * Si no existe la clave, la inicializa en 1.
 * @returns {number} Número del subnivel máximo desbloqueado
 */
function getUnlockedLevel() {
  let u = localStorage.getItem('subsuelo_unlocked');
  if (!u) { u = 1; localStorage.setItem('subsuelo_unlocked', u); }
  return parseInt(u, 10);
}

/**
 * setUnlockedLevel(level)
 * -----------------------
 * Guarda el nuevo nivel desbloqueado, solo si es mayor al actual.
 * Evita regresiones en el progreso del jugador.
 * @param {number} level - Subnivel a desbloquear
 */
function setUnlockedLevel(level) {
  if (level > getUnlockedLevel()) localStorage.setItem('subsuelo_unlocked', level);
}


// ===================================================
//  SECCIÓN 8: ESCENA PRELOAD
//
//  Primera escena de Phaser. Su única función es
//  precargar los dos archivos de audio (MP3) antes
//  de que el jugador llegue a los subniveles 10 y 20.
//  Al terminar la carga lanza automáticamente LevelSelect.
// ===================================================
class Preload extends Phaser.Scene {
  constructor() { super({ key: 'Preload' }); }

  /**
   * preload()
   * ---------
   * Carga los archivos de audio desde la carpeta ../assets/audio/.
   *  - 'n1_song1' → canción del subnivel 10
   *  - 'n1_song2' → canción del subnivel 20
   */
  preload() {
    this.load.audio('n1_song1', '../assets/audio/cancion1.mp3');
    this.load.audio('n1_song2', '../assets/audio/cancion2.mp3');
  }

  /** create() — Se ejecuta automáticamente al terminar preload(). */
  create() { this.scene.start('LevelSelect'); }
}


// ===================================================
//  SECCIÓN 9: ESCENA LEVEL SELECT (SELECTOR DE SUBNIVELES)
//
//  Muestra una cuadrícula de 4 filas × 5 columnas (20 cartas).
//  Cada carta puede estar en tres estados visuales:
//    • Activa normal (verde oscuro + borde verde)
//    • Activa canción (marrón + borde naranja + icono 🎵)
//    • Bloqueada (gris + candado 🔒)
//
//  Al hacer clic en una carta desbloqueada lanza PlayGame
//  con el subnivel y la frase correspondiente.
//  Al hacer clic en una carta bloqueada muestra un aviso
//  temporal que desaparece con tween de opacidad.
// ===================================================
class LevelSelect extends Phaser.Scene {
  constructor() { super({ key: 'LevelSelect' }); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    const unlocked = getUnlockedLevel(); // Subnivel máximo habilitado

    // Limpia elementos DOM residuales de escenas anteriores
    document.querySelectorAll('.typing-overlay, #personaje-wrap, .bandera-overlay')
      .forEach(el => el.remove());

    // Fondo principal de la escena (marrón muy oscuro)
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a0a00);

    // Título y subtítulos informativos
    this.add.text(W / 2, 38, 'NIVEL 1 — SUBSUELO', {
      fontSize: '26px', fill: '#e8a060',
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, 68, 'Completa frases para avanzar • 4 vidas por subnivel', {
      fontSize: '13px', fill: '#6a3a10', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(W / 2, 88, 'Selecciona un subnivel', {
      fontSize: '13px', fill: '#555', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Botón de navegación al menú principal (index1.html)
    const menuBtn = this.add.text(20, 12, '← Menú', {
      fontSize: '15px', fill: '#aaa', fontFamily: 'Courier New'
    }).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#fff' }));
    menuBtn.on('pointerout',  () => menuBtn.setStyle({ fill: '#aaa' }));
    menuBtn.on('pointerdown', () => window.location.href = 'index1.html');

    // ── Construcción de la cuadrícula de subniveles ─────────────────
    // 5 columnas, 4 filas; cada carta mide 145×78 px con gaps de 26 px.
    const cols = 5, cardW = 145, cardH = 78, gapX = 26, gapY = 26;
    const gridWidth = cols * cardW + (cols - 1) * gapX;
    const startX = (W - gridWidth) / 2 + cardW / 2;
    const startY = 165 + cardH / 2;

    for (let i = 0; i < 20; i++) {
      const sublevel    = i + 1;
      const col         = i % cols;
      const row         = Math.floor(i / cols);
      const x           = startX + col * (cardW + gapX); // Centro X de la carta
      const y           = startY + row * (cardH + gapY); // Centro Y de la carta
      const isActive    = sublevel <= unlocked;           // ¿Está desbloqueado?
      const isSong      = sublevel === 10 || sublevel === 20; // ¿Es subnivel de canción?

      // Colores dinámicos según estado de la carta
      const bgColor     = isActive ? (isSong ? 0x4d2200 : 0x2d6e1a) : 0x2a2a2a;
      const txtColor    = isActive ? '#ffffff' : '#555555';
      const strokeColor = isActive ? (isSong ? 0xff8833 : 0x55cc33) : 0x444444;
      const hoverColor  = isSong ? 0x6e3300 : 0x3d9e25; // Color al pasar el cursor
      const playColor   = isActive ? (isSong ? '#ffaa55' : '#88ff66') : '#444';
      const amb         = getAmbiente(sublevel); // Ambiente para mostrar etiqueta

      // Rectángulo de fondo de la carta con borde de color
      const btn = this.add.rectangle(x, y, cardW, cardH, bgColor)
        .setStrokeStyle(3, strokeColor);

      // Comportamiento interactivo: activo vs. bloqueado
      if (isActive) {
          btn.setInteractive({ useHandCursor: true });
          btn.on('pointerover', () => btn.setFillStyle(0x3d9e25));  // Hover verde
          btn.on('pointerout',  () => btn.setFillStyle(bgColor));
          btn.on('pointerdown', () => {
              // Lanza PlayGame con el subnivel e índice del texto correspondiente
              this.scene.start('PlayGame', { sublevel: i + 1, word: words20[i] });
          });
      } else {
          // Cartas bloqueadas: hover gris + mensaje de bloqueo
          btn.setInteractive({ useHandCursor: true });
          btn.on('pointerover', () => btn.setFillStyle(0x3a3a3a));
          btn.on('pointerout',  () => btn.setFillStyle(bgColor));
          btn.on('pointerdown', () => this.showLockedMessage(i + 1));
      }

      // Línea 1: "Sub N" en fuente Oxanium
      this.add.text(x, y - 16, `Sub ${sublevel}`, {
        fontSize: '16px', fill: txtColor,
        fontFamily: 'Oxanium, sans-serif', fontStyle: '700'
      }).setOrigin(0.5);

      // Línea 2: etiqueta del ambiente (SUBSUELO / SUPERFICIE / ESPACIO)
      this.add.text(x, y + 4, amb.label, {
        fontSize: '10px', fill: isActive ? amb.labelColor : '#444',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);

      // Línea 3: icono de estado (▶ activo | 🎵 canción | 🔒 bloqueado)
      this.add.text(x, y + 22, isActive ? (isSong ? '🎵' : '▶') : '🔒', {
        fontSize: '14px', fill: playColor, fontFamily: 'Courier New'
      }).setOrigin(0.5);
    }
  }

  /**
   * showLockedMessage(sublevelNum)
   * ------------------------------
   * Muestra un aviso en la parte inferior de la pantalla indicando
   * qué subnivel anterior debe completarse antes.
   *
   * Flujo:
   *  1. Si ya hay un mensaje visible (_lockMsg), no apila otro.
   *  2. Crea un rectángulo de fondo + ícono 🔒 + texto de mensaje.
   *  3. Espera 2000 ms y luego hace fade-out en 1000 ms con tween.
   *  4. Al completar el tween destruye los objetos y libera _lockMsg.
   *
   * @param {number} sublevelNum - Número del subnivel bloqueado clicado
   */
  showLockedMessage(sublevelNum) {
    if (this._lockMsg) return; // Evita apilar mensajes simultáneos

    const W = this.scale.width;
    const H = this.scale.height;

    // Fondo del aviso
    const bg = this.add.rectangle(W / 2, H - 90, 480, 52, 0x1a0a00)
        .setStrokeStyle(2, 0xcc4400)
        .setDepth(20);

    // Ícono de candado
    const icon = this.add.text(W / 2 - 210, H - 90, '🔒', {
        fontSize: '18px'
    }).setOrigin(0, 0.5).setDepth(20);

    // Texto del aviso
    const msg = this.add.text(W / 2 - 180, H - 90,
        `Completa el subnivel ${sublevelNum - 1} primero`, {
        fontSize: '14px', fill: '#e8a060',
        fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(20);

    this._lockMsg = [bg, icon, msg]; // Guarda referencias para el tween

    // Tween: espera 2 s visible, luego desvanece en 1 s y destruye
    this.tweens.add({
        targets:    this._lockMsg,
        alpha:      0,
        delay:      2000,
        duration:   1000,
        ease:       'Sine.easeIn',
        onComplete: () => {
            this._lockMsg.forEach(obj => obj.destroy());
            this._lockMsg = null;
        }
    });
  }
}


// ===================================================
//  SECCIÓN 10: ESCENA PLAY GAME (JUEGO PRINCIPAL)
//
//  Escena central del juego. Gestiona:
//    • Renderizado del fondo según ambiente
//    • Overlay HTML con la frase a tipear (coloreada por estado)
//    • Input invisible que captura el teclado
//    • Timer de cuenta regresiva (60 s normal / 240 s canciones)
//    • Sistema de vidas (4 corazones, se pierde uno por error)
//    • Personaje animado que avanza/retrocede según el tipeado
//    • Métricas de WPM y precisión en tiempo real
//    • Barra de progreso visual
//    • Reproducción de audio en subniveles de canción
//    • Transición a ResultScreen (victoria/derrota)
// ===================================================
class PlayGame extends Phaser.Scene {
  constructor() { super({ key: 'PlayGame' }); }

  /**
   * init(data)
   * ----------
   * Inicializa el estado de la escena con los datos recibidos
   * desde LevelSelect o ResultScreen (reintentar / siguiente).
   *
   * @param {object} data
   * @param {number}  data.sublevel   - Número de subnivel (1–20)
   * @param {string}  data.word       - Texto/frase a tipear
   * @param {number}  [data.timeLimit]- Tiempo máximo en segundos (60 u 240)
   */
  init(data) {
    this.sublevel     = data.sublevel || 1;
    // Los subniveles 10 y 20 son de canción: tienen comportamiento especial
    this.isSongLevel  = this.sublevel === 10 || this.sublevel === 20;

    // Para canciones, normaliza saltos de línea a espacios para el tipeado lineal
    this.targetText   = this.isSongLevel
      ? (data.word || '').replace(/\n+/g, ' ').trim()
      : (data.word || '');

    this.typed        = '';       // Texto que el jugador ha escrito hasta ahora
    this.lastTypedLen = 0;        // Longitud del texto en el evento anterior (para detectar borrado)
    this.timeLeft     = data.timeLimit || 60;  // Segundos restantes
    this.initialTime  = this.timeLeft;         // Tiempo inicial (para mostrar en resultados)
    this.finished     = false;    // Flag: si true bloquea toda interacción
    this.timerStarted = false;    // Flag: el timer solo arranca con el primer carácter
    this.startTime    = null;     // Timestamp de inicio (para cálculo de WPM)
    this.timerEvent   = null;     // Referencia al TimerEvent de Phaser (para detenerlo)
    this.overlay      = null;     // Div HTML del overlay de tipeado
    this.inputEl      = null;     // <input> invisible que recibe el teclado
    this.phraseEl     = null;     // Div con el texto coloreado
    this.scrollBox    = null;     // Contenedor con scroll para canciones
    this.music        = null;     // Objeto de audio de Phaser
    this.musicEnabled = true;     // Estado del toggle de música
    this.personaje    = null;     // Instancia de la clase Personaje
    this.sistemaVidas = null;     // Instancia de la clase SistemaVidas
    this.ambiente     = getAmbiente(this.sublevel); // Ambiente visual activo
  }

  /**
   * create()
   * --------
   * Construye todos los elementos visuales de la escena:
   *  1. Fondo de color sólido + decoraciones gráficas del ambiente
   *  2. Título del subnivel y botón "← Volver"
   *  3. Timer (texto Phaser, actualizado en _tickTimer)
   *  4. Botón de toggle de música (solo en canciones)
   *  5. Contadores WPM y precisión
   *  6. Barra de progreso (rectángulo que crece con el % completado)
   *  7. Sistema de vidas (4 corazones encima del canvas)
   *  8. Personaje HTML animado
   *  9. Overlay HTML con la frase y el input de teclado
   * 10. Objeto de audio (solo en canciones)
   */
  create() {
    const W = this.scale.width, H = this.scale.height;
    const amb = this.ambiente;

    // ── 1. Fondo ────────────────────────────────────────────────────
    this.add.rectangle(W / 2, H / 2, W, H, amb.bgColor);
    this._dibujarFondo(W, H, amb); // Decoraciones específicas de cada ambiente

    // ── 2. Título y botón de retroceso ──────────────────────────────
    this.add.text(W / 2, 28, `SUBNIVEL ${this.sublevel} — ${amb.label}`, {
      fontSize: '18px', fill: amb.labelColor,
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    const back = this.add.text(16, 12, '← Volver', {
      fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New'
    }).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
    back.on('pointerout',  () => back.setStyle({ fill: '#aaa' }));
    back.on('pointerdown', () => {
      this._stopMusic();  // Para la música antes de salir
      this._cleanup();    // Limpia DOM residual
      this.scene.start('LevelSelect');
    });

    // ── 3. Timer (inicialmente muestra "Escribe para iniciar") ───────
    this.timerPhaserText = this.add.text(W - 16, 12, '⏱ Escribe para iniciar', {
      fontSize: '15px', fill: '#888', fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(1, 0);

    // ── 4. Botón de toggle de música (solo en subniveles de canción) ─
    if (this.isSongLevel) {
      const soundBtn = this.add.text(W - 110, 12, '🔊', {
        fontSize: '20px', fill: '#ffdd55', fontFamily: 'Courier New'
      }).setInteractive({ useHandCursor: true });
      soundBtn.on('pointerdown', () => {
        this.musicEnabled = !this.musicEnabled;
        soundBtn.setText(this.musicEnabled ? '🔊' : '🔇'); // Cambia ícono
        if (this.music) {
          // Pausa o reanuda el audio según el estado del toggle
          this.musicEnabled ? this.music.resume() : this.music.pause();
        }
      });
    }

    // ── 5. Contadores de WPM y precisión ────────────────────────────
    this.wpmPhaserText = this.add.text(16, 38, 'WPM: 0', {
      fontSize: '14px', fill: '#66ccff', fontFamily: 'Courier New'
    });
    this.accPhaserText = this.add.text(16, 58, 'Precisión: 100%', {
      fontSize: '14px', fill: '#aaffaa', fontFamily: 'Courier New'
    });

    // Instrucción descriptiva sobre la tarea
    this.add.text(W / 2, 85, 'Escribe la frase exactamente como aparece:', {
      fontSize: '12px', fill: '#555', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // ── 6. Barra de progreso ─────────────────────────────────────────
    // Fondo gris fijo + barra verde que crece con el % completado
    this.add.rectangle(W / 2, H - 28, W - 60, 14, 0x2a2a2a).setOrigin(0.5);
    this.progressBar  = this.add.rectangle(30, H - 28, 2, 10, 0x2d6e1a).setOrigin(0, 0.5);
    this.progressMaxW = W - 60; // Ancho máximo de la barra (= 100%)
    this.progressPct  = this.add.text(W / 2, H - 28, '0%', {
      fontSize: '10px', fill: '#888', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Pista inicial que desaparece al empezar a escribir
    this.hintText = this.add.text(W / 2, H - 60, '🖱 Haz clic en la pantalla para escribir', {
      fontSize: '12px', fill: '#444', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // ── 7. Sistema de vidas ──────────────────────────────────────────
    this.sistemaVidas = new SistemaVidas(this, 4);
    this.sistemaVidas.crear(W / 2 - 56, 36); // Centrado en la parte superior

    // ── 8. Personaje HTML ────────────────────────────────────────────
    this.personaje = new Personaje(this, amb);

    // ── 9. Overlay HTML con la frase y el input ──────────────────────
    this._buildHTMLOverlay(W, H);

    // ── 10. Carga del audio (solo si el caché contiene el archivo) ───
    if (this.isSongLevel) {
      const audioKey = this.sublevel === 10 ? 'n1_song1' : 'n1_song2';
      if (this.cache.audio.exists(audioKey)) {
        this.music = this.sound.add(audioKey, { loop: false, volume: 0.5 });
      }
    }
  }

  /**
   * _dibujarFondo(W, H, amb)
   * ------------------------
   * Dibuja decoraciones de fondo específicas de cada ambiente
   * usando la API Graphics de Phaser (sin ningún sprite externo).
   *
   *  • espacio   → 100 puntos blancos de tamaño aleatorio (estrellas)
   *  • superficie→ franja verde inferior (suelo) + manchas blancas (nubes)
   *  • subsuelo  → elipses marrones irregulares (rocas/grutas) + suelo
   *
   * @param {number} W   - Ancho del canvas
   * @param {number} H   - Alto del canvas
   * @param {object} amb - Objeto de ambiente activo
   */
  _dibujarFondo(W, H, amb) {
    const g = this.add.graphics();
    if (amb === AMBIENTES.espacio) {
      // Estrellas: puntos blancos semitransparentes de radio 1 ó 1.5 px
      g.fillStyle(0xffffff, 0.6);
      for (let i = 0; i < 100; i++) {
        g.fillCircle(Math.random() * W, Math.random() * H,
          Math.random() < 0.7 ? 1 : 1.5);
      }
    } else if (amb === AMBIENTES.superficie) {
      // Suelo verde semi-opaco en la franja inferior
      g.fillStyle(0x224400, 0.5);
      g.fillRect(0, H - 50, W, 50);
      // Nubes: elipses blancas muy tenues
      g.fillStyle(0xffffff, 0.08);
      [150, 350, 600, 820].forEach(cx => {
        g.fillEllipse(cx, 130, 120, 40);
        g.fillEllipse(cx + 40, 120, 90, 35);
      });
    } else {
      // Subsuelo: grutas/rocas como elipses marrones irregulares
      g.fillStyle(0x2d1000, 0.4);
      for (let i = 0; i < 12; i++) {
        g.fillEllipse(Math.random() * W, Math.random() * H,
          Math.random() * 60 + 20, Math.random() * 30 + 10);
      }
      // Suelo: franja marrón oscura en la parte inferior
      g.fillStyle(0x3a1500, 0.6);
      g.fillRect(0, H - 45, W, 45);
    }
  }

  /**
   * _buildHTMLOverlay(W, H)
   * -----------------------
   * Crea el overlay HTML que superpone al canvas de Phaser para:
   *  • Mostrar la frase con coloreado char-a-char (verde/rojo/gris)
   *  • Recibir el input del teclado mediante un <input> invisible
   *
   * Estructura DOM generada:
   *   div.typing-overlay (contenedor fijo)
   *     └─ div.scrollBox   (caja de texto con scroll para canciones)
   *          └─ div#phraseEl (texto coloreado renderizado con innerHTML)
   *     └─ input (capturador de teclado fuera de pantalla)
   *
   * El overlay se escala proporcionalmente al canvas gracias a
   * getBoundingClientRect() + cálculo de scaleX.
   *
   * @param {number} W - Ancho lógico del canvas Phaser
   * @param {number} H - Alto lógico del canvas Phaser
   */
  _buildHTMLOverlay(W, H) {
    const canvas    = this.game.canvas;
    const rect      = canvas.getBoundingClientRect(); // Posición real del canvas
    const scaleX    = rect.width / W;                 // Factor de escala horizontal
    const scaleFont = Math.min(scaleX, 1.2);          // Cap de escala para tipografía

    // Div contenedor fijo posicionado sobre el canvas
    this.overlay = document.createElement('div');
    this.overlay.className = 'typing-overlay';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: rect.top + 'px', left: rect.left + 'px',
      width: rect.width + 'px', height: rect.height + 'px',
      pointerEvents: 'none', zIndex: '10',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: `${Math.round(170 * scaleX)}px` // Deja espacio para HUD de Phaser
    });

    // Color del borde de la caja según ambiente
    const borderColor = this.ambiente === AMBIENTES.espacio    ? '#1a1a7a'
                      : this.ambiente === AMBIENTES.superficie ? '#2a7a30'
                      : '#7a3b00';

    // Caja de texto (más alta en canciones para mostrar más versos)
    this.scrollBox = document.createElement('div');
    Object.assign(this.scrollBox.style, {
      background: 'rgba(8,6,4,0.82)',
      border: `2px solid ${borderColor}`,
      borderRadius: '18px', padding: '28px 34px',
      maxWidth: `${Math.round(1100 * scaleX)}px`, width: '95%',
      minHeight: `${Math.round(260 * scaleX)}px`,
      // Las canciones tienen caja más grande para alojar múltiples líneas
      height:    this.isSongLevel ? `${Math.round(460 * scaleX)}px` : `${Math.round(260 * scaleX)}px`,
      maxHeight: this.isSongLevel ? `${Math.round(460 * scaleX)}px` : `${Math.round(260 * scaleX)}px`,
      overflow: 'hidden', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 30px rgba(255,120,40,0.12), inset 0 0 28px rgba(0,0,0,0.45)'
    });

    // Color del texto según ambiente
    const txtColor = this.ambiente === AMBIENTES.espacio    ? '#eef1ff'
                   : this.ambiente === AMBIENTES.superficie ? '#effff1'
                   : '#f4efe8';

    // Div interno que contiene el texto coloreado
    this.phraseEl = document.createElement('div');
    Object.assign(this.phraseEl.style, {
      fontFamily: '"Oxanium","Orbitron",sans-serif',
      // Canciones usan fuente más pequeña para caber en la caja
      fontSize: this.isSongLevel
        ? `${Math.round(22 * scaleFont)}px`
        : `${Math.round(30 * scaleFont)}px`,
      lineHeight: '1.6', textAlign: 'center',
      letterSpacing: '1.2px', wordBreak: 'break-word',
      overflowWrap: 'break-word', whiteSpace: 'pre-wrap',
      userSelect: 'none', color: txtColor,
      width: '100%', maxWidth: '100%',
      padding: '0 10px', margin: '0 auto',
      transform: 'translateY(0px)', transition: 'transform 0.08s linear'
    });

    this._renderPhrase();          // Renderiza el texto inicial (todo en gris pendiente)
    this.scrollBox.appendChild(this.phraseEl);
    this.overlay.appendChild(this.scrollBox);

    // Input invisible: captura el teclado sin mostrar nada al usuario
    this.inputEl = document.createElement('input');
    Object.assign(this.inputEl.style, {
      position: 'fixed', top: '-9999px', left: '-9999px',
      opacity: '0', width: '1px', height: '1px',
      border: 'none', outline: 'none', pointerEvents: 'all'
    });
    // Desactiva autocorrección para no interferir con el tipeado exacto
    this.inputEl.setAttribute('autocomplete',   'off');
    this.inputEl.setAttribute('autocorrect',    'off');
    this.inputEl.setAttribute('autocapitalize', 'none');
    this.inputEl.setAttribute('spellcheck',     'false');
    // Listeners de eventos del input
    this.inputEl.addEventListener('input',   () => this._onInput());
    this.inputEl.addEventListener('paste',   e  => e.preventDefault()); // Bloquea pegar texto
    this.inputEl.addEventListener('keydown', e  => { if (this.finished) e.preventDefault(); });

    this.overlay.appendChild(this.inputEl);
    document.body.appendChild(this.overlay);

    // Auto-foco tras 150 ms para asegurar que el DOM está listo
    setTimeout(() => this.inputEl.focus(), 150);
    // Re-foco al hacer clic en el canvas de Phaser
    this.game.canvas.addEventListener('click', () => this.inputEl.focus());
  }

  /**
   * _renderPhrase()
   * ---------------
   * Renderiza el texto de la frase con coloreado por estado de cada carácter.
   * Se llama en cada evento input y en cada tick del timer (canciones).
   *
   * Colores por estado del carácter en posición i:
   *  • i < typed.length & correcto  → verde brillante (#44ff66)
   *  • i < typed.length & incorrecto→ rojo (#ff4444) + fondo rojo tenue
   *  • i === typed.length (cursor)  → blanco + borde inferior del color del ambiente
   *  • i > typed.length (pendiente) → gris oscuro (#4a4a4a)
   *
   * Los espacios siempre se renderizan como &nbsp; para visibilidad.
   *
   * Para canciones, aplica un scroll automático mediante translateY
   * calculado en base al progreso de reproducción del audio (o al
   * % de texto tipeado si el audio no está activo).
   */
  _renderPhrase() {
    const target = this.targetText, typed = this.typed;
    // Color del cursor según ambiente
    const cursorColor = this.ambiente === AMBIENTES.espacio    ? '#a0a8ff'
                      : this.ambiente === AMBIENTES.superficie ? '#7ecf5a'
                      : '#ffdd55';
    let html = '';

    for (let i = 0; i < target.length; i++) {
      const ch      = target[i];
      const display = ch === ' ' ? '&nbsp;' : ch; // Espacio visible

      if (i < typed.length) {
        // Carácter ya tipeado: verde si correcto, rojo si incorrecto
        html += typed[i] === target[i]
          ? `<span style="color:#44ff66">${display}</span>`
          : ch === ' '
            ? `<span style="color:#ff4444;text-decoration:underline">&nbsp;</span>`
            : `<span style="color:#ff4444;background:rgba(255,0,0,0.12)">${display}</span>`;
      } else if (i === typed.length) {
        // Posición del cursor: borde inferior animado
        html += `<span style="color:#fff;border-bottom:2px solid ${cursorColor};padding-bottom:1px">${display}</span>`;
      } else {
        // Carácter pendiente: gris oscuro
        html += `<span style="color:#4a4a4a">${display}</span>`;
      }
    }

    this.phraseEl.innerHTML = html;

    // ── Scroll automático para canciones ──────────────────────────
    // Desplaza el texto hacia arriba con translateY para simular scroll
    if (this.isSongLevel && this.scrollBox && this.phraseEl) {
      const maxMove = Math.max(0, this.phraseEl.scrollHeight - this.scrollBox.clientHeight);
      let progress  = 0;
      if (this.music && this.music.isPlaying && this.music.duration > 0) {
        // Basa el scroll en la posición de reproducción del audio
        // (con offset de 10 s para que el texto anticipe ligeramente la música)
        progress = Math.max(0, this.music.seek - 10) / Math.max(1, this.music.duration - 10);
      } else {
        // Sin audio, el scroll sigue el % de texto completado
        progress = target.length > 0 ? typed.length / target.length : 0;
      }
      progress = Phaser.Math.Clamp(progress, 0, 1); // Mantiene entre 0 y 1
      // Solo aplica el 20% del desplazamiento máximo (scroll suave)
      this.phraseEl.style.transform = `translateY(-${maxMove * progress * 0.20}px)`;
    }
  }

  /**
   * _onInput()
   * ----------
   * Handler del evento 'input' del elemento invisible.
   * Es el núcleo de la lógica de tipeado.
   *
   * Flujo:
   *  1. Ignora si la partida ya terminó (this.finished)
   *  2. Normaliza el valor: para canciones elimina saltos de línea
   *  3. Trunca si supera la longitud del texto objetivo
   *  4. Inicia el timer al primer carácter (arranque retardado)
   *  5. Detecta si se escribió (raw.length > lastTypedLen) o borró
   *  6. Si se escribió un carácter correcto → avanza personaje
   *     Si se escribió un carácter incorrecto → registra error
   *  7. Actualiza typed, lastTypedLen, re-renderiza la frase y las métricas
   *  8. Si typed === targetText → llama a _endGame(true)
   */
  _onInput() {
    if (this.finished) return; // La partida ya terminó, ignora todo input

    let raw = this.inputEl.value;

    // Normalización para canciones: elimina saltos de línea del input
    if (this.isSongLevel) {
      raw = raw.replace(/\n+/g, ' ').trimStart();
      this.inputEl.value = raw;
    }

    // Previene sobrepasar la longitud del texto objetivo
    if (raw.length > this.targetText.length) {
      raw = raw.slice(0, this.targetText.length);
      this.inputEl.value = raw;
    }

    // ── Inicio del timer al primer carácter tipeado ───────────────
    if (!this.timerStarted && raw.length > 0) {
      this.timerStarted = true;
      this.startTime    = Date.now(); // Marca de inicio para WPM
      this.timerPhaserText.setText(`⏱ ${this.initialTime}s`);
      this.timerPhaserText.setStyle({ fill: '#ffdd55', fontSize: '18px' });
      this.hintText.setVisible(false); // Oculta la pista inicial
      // Inicia el tick de 1 segundo
      this.timerEvent = this.time.addEvent({
        delay: 1000, loop: true,
        callback: this._tickTimer, callbackScope: this
      });
      // Inicia la música (si aplica y está habilitada)
      if (this.isSongLevel && this.music && this.musicEnabled) {
        this.music.play();
      }
    }

    // ── Detección de acción: escribir vs. borrar ──────────────────
    const escribiendo = raw.length > this.lastTypedLen;
    const borrando    = raw.length < this.lastTypedLen;

    if (escribiendo) {
      const pos = raw.length - 1; // Posición del carácter recién añadido
      if (raw[pos] === this.targetText[pos]) {
        // Carácter correcto → avanza personaje
        this.personaje.caminarPaso();
      } else {
        // Carácter incorrecto → registra error (pierde vida)
        this._registrarError();
      }
    } else if (borrando) {
      // Borrado → personaje vuelve a idle
      this.personaje.idle();
    }

    // ── Actualización del estado ──────────────────────────────────
    this.typed        = raw;
    this.lastTypedLen = raw.length;

    this._renderPhrase();  // Re-colorea el texto
    this._updateStats();   // Actualiza WPM, precisión y barra de progreso

    // ── Comprobación de victoria ──────────────────────────────────
    if (this.typed === this.targetText) {
      this._endGame(true);
    }
  }

  /**
   * _registrarError()
   * -----------------
   * Se llama cuando el jugador teclea un carácter incorrecto.
   * Efectos:
   *  • Anima el daño en el personaje (retroceso + sacudida)
   *  • Flash rojo en la cámara de Phaser (180 ms)
   *  • Descuenta una vida en SistemaVidas
   *  • Si no quedan vidas, dispara _perderSubnivel()
   */
  _registrarError() {
    this.personaje.animarDaño();
    this.cameras.main.flash(180, 255, 0, 0, false); // Flash rojo de 180 ms
    this.sistemaVidas.perderVida(() => {
      this._perderSubnivel(); // Callback ejecutado al agotar las vidas
    });
  }

  /**
   * _perderSubnivel()
   * -----------------
   * Termina la partida por derrota (sin vidas).
   * Efectos:
   *  1. Marca finished=true y detiene el timer
   *  2. Para la música
   *  3. Sacude y flash rojo en la cámara (400 ms)
   *  4. Tras 600 ms lanza ResultScreen con won=false y causa='vidas'
   */
  _perderSubnivel() {
    if (this.finished) return;
    this.finished = true;
    if (this.timerEvent) this.timerEvent.remove();
    this._stopMusic();
    this.cameras.main.shake(400, 0.018); // Sacudida de 400 ms
    this.cameras.main.flash(400, 255, 0, 0); // Flash rojo de 400 ms
    this.time.delayedCall(600, () => {
      this._cleanup();
      this.scene.start('ResultScreen', {
        won: false, acc: 0, wpm: 0,
        typed: this.typed, target: this.targetText,
        sublevel: this.sublevel,
        timeUsed: this.initialTime - this.timeLeft,
        correct: 0, total: this.targetText.length,
        initialTime: this.initialTime, causa: 'vidas'
      });
    });
  }

  /**
   * _updateStats()
   * --------------
   * Recalcula y muestra en tiempo real:
   *  • Barra de progreso: ancho proporcional al % de texto completado
   *  • Porcentaje numérico encima de la barra
   *  • WPM: palabras contadas en this.typed / minutos transcurridos
   *  • Precisión: chars correctos / total chars tipeados × 100
   *
   * Solo calcula WPM si this.startTime está definido (timer iniciado).
   */
  _updateStats() {
    const typed = this.typed, target = this.targetText;
    const pct   = typed.length / target.length;

    // Actualiza la barra de progreso (mínimo 2 px de ancho para visibilidad)
    this.progressBar.width = Math.max(2, this.progressMaxW * pct);
    this.progressPct.setText(Math.round(pct * 100) + '%');

    // Cálculo de WPM (palabras por minuto)
    if (this.startTime) {
      const mins  = (Date.now() - this.startTime) / 60000;
      const words = typed.trim().split(/\s+/).filter(Boolean).length;
      const wpm   = mins > 0 ? Math.round(words / mins) : 0;
      this.wpmPhaserText.setText(`WPM: ${wpm}`);
    }

    // Cálculo de precisión (chars correctos / chars tipeados)
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) correct++;
    }
    this.accPhaserText.setText(
      `Precisión: ${typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100}%`
    );
  }

  /**
   * _tickTimer()
   * ------------
   * Callback del TimerEvent de Phaser, ejecutado cada 1000 ms.
   * Descuenta un segundo de timeLeft y actualiza el texto del timer.
   * Cambia el color del texto según la urgencia:
   *  • <= 10 s → rojo (#ff4444)
   *  • <= 20 s → naranja (#ffaa00)
   * Para canciones, llama a _renderPhrase() para actualizar el scroll.
   * Si timeLeft llega a 0 llama a _endGame(false) (derrota por tiempo).
   */
  _tickTimer() {
    if (this.finished) return;
    this.timeLeft--;
    this.timerPhaserText.setText(`⏱ ${this.timeLeft}s`);
    if      (this.timeLeft <= 10) this.timerPhaserText.setStyle({ fill: '#ff4444' });
    else if (this.timeLeft <= 20) this.timerPhaserText.setStyle({ fill: '#ffaa00' });
    if (this.isSongLevel) this._renderPhrase(); // Actualiza scroll de la canción cada segundo
    if (this.timeLeft <= 0) this._endGame(false); // Tiempo agotado → derrota
  }

  /**
   * _stopMusic()
   * ------------
   * Detiene y destruye el objeto de audio de Phaser de forma segura.
   * Pone this.music a null para evitar referencias colgantes.
   */
  _stopMusic() {
    if (this.music) { this.music.stop(); this.music.destroy(); this.music = null; }
  }

  /**
   * _endGame(won)
   * -------------
   * Finaliza la partida (victoria o derrota por tiempo).
   * Calcula las métricas finales:
   *  • acc    : precisión (chars correctos / total chars tipeados × 100)
   *  • wpm    : velocidad de tipeado
   *  • correct: total de caracteres acertados
   *  • timeUsed: tiempo consumido (initialTime - timeLeft)
   *
   * Si won=true:
   *  1. Desbloquea el siguiente subnivel (setUnlockedLevel)
   *  2. Anima la victoria del personaje
   *  3. Limpia el overlay DOM
   *  4. Muestra BanderaColombia durante 2400 ms
   *  5. Al cerrar la bandera, lanza ResultScreen con won=true
   *
   * Si won=false (tiempo agotado):
   *  1. Limpia el overlay DOM
   *  2. Lanza ResultScreen inmediatamente con won=false y causa='tiempo'
   *
   * @param {boolean} won - true si el jugador completó la frase antes de que
   *                        se agotara el tiempo / las vidas
   */
  _endGame(won) {
    if (this.finished) return;
    this.finished = true;
    if (this.timerEvent) this.timerEvent.remove();
    this._stopMusic();

    // ── Cálculo de métricas finales ──────────────────────────────
    const typed   = this.typed, target = this.targetText;
    let   correct = 0;
    for (let i = 0; i < typed.length; i++) { if (typed[i] === target[i]) correct++; }

    const acc      = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
    const elapsed  = this.startTime ? (Date.now() - this.startTime) / 60000 : 1 / 60;
    const words    = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm      = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const timeUsed = this.initialTime - this.timeLeft;

    if (won) {
      // Desbloquea el subnivel siguiente (solo avanza, nunca retrocede)
      if (this.sublevel < 20) setUnlockedLevel(this.sublevel + 1);
      if (this.personaje) this.personaje.animarVictoria();
      this._cleanup();

      // Overlay de bandera antes de mostrar resultados
      const bandera = new BanderaColombia();
      bandera.mostrar(this.sublevel, () => {
        this.scene.start('ResultScreen', {
          won, acc, wpm, typed, target,
          sublevel: this.sublevel,
          timeUsed, correct, total: target.length,
          initialTime: this.initialTime
        });
      }, 2400);
    } else {
      // Derrota por tiempo: va directo a ResultScreen
      this._cleanup();
      this.scene.start('ResultScreen', {
        won, acc, wpm, typed, target,
        sublevel: this.sublevel,
        timeUsed, correct, total: target.length,
        initialTime: this.initialTime, causa: 'tiempo'
      });
    }
  }

  /**
   * _cleanup()
   * ----------
   * Elimina todos los elementos HTML/DOM añadidos por esta escena:
   *  • Detiene y destruye el audio
   *  • Destruye el personaje (quita el div del DOM)
   *  • Destruye el sistema de vidas (quita los corazones del canvas)
   *  • Elimina el overlay de tipeado del DOM
   *  • Elimina cualquier overlay de bandera residual
   *
   * Se llama siempre antes de cambiar de escena para evitar
   * elementos HTML flotantes sobre otras escenas.
   */
  _cleanup() {
    this._stopMusic();
    if (this.personaje)    { this.personaje.destruir();   this.personaje = null; }
    if (this.sistemaVidas) { this.sistemaVidas.destruir(); this.sistemaVidas = null; }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }
    document.querySelectorAll('.bandera-overlay').forEach(el => el.remove());
  }

  // Phaser llama a shutdown() y destroy() al desmontar la escena.
  // Ambos delegan en _cleanup() para garantizar limpieza en todos los flujos.
  shutdown() { this._cleanup(); }
  destroy()  { this._cleanup(); }
}


// ===================================================
//  SECCIÓN 11: ESCENA RESULT SCREEN (PANTALLA DE RESULTADOS)
//
//  Muestra el desempeño del jugador al terminar un subnivel,
//  ya sea por victoria, por agotar vidas o por tiempo.
//
//  Elementos visuales:
//    • Panel central con borde verde (victoria) o rojo (derrota)
//    • Ícono + título grandes según el tipo de resultado
//    • Tabla de 5 métricas: tiempo, velocidad, precisión,
//      correctas, errores
//    • Mensaje motivacional según resultado y precisión
//    • Botones de acción (hasta 4, centrados):
//        ↺ Reintentar | ☰ Subniveles | ▶ Siguiente | 🏠 Menú
//      (el botón "Siguiente" solo aparece si ganó y no es el subnivel 20)
// ===================================================
class ResultScreen extends Phaser.Scene {
  constructor() { super({ key: 'ResultScreen' }); }

  /**
   * init(data)
   * ----------
   * Recibe y almacena todos los datos del resultado de la partida.
   *
   * @param {object}  data
   * @param {boolean} data.won         - ¿El jugador completó la frase?
   * @param {number}  data.acc         - Precisión en porcentaje (0–100)
   * @param {number}  data.wpm         - Palabras por minuto
   * @param {number}  data.sublevel    - Número del subnivel jugado
   * @param {number}  data.timeUsed    - Segundos utilizados
   * @param {string}  data.typed       - Texto tipeado por el jugador
   * @param {string}  data.target      - Texto objetivo
   * @param {number}  data.correct     - Caracteres correctos
   * @param {number}  data.total       - Total de caracteres del texto
   * @param {number}  data.initialTime - Tiempo máximo en segundos
   * @param {string}  [data.causa]     - 'tiempo' | 'vidas' (solo en derrota)
   */
  init(data) {
    this.won         = data.won;
    this.acc         = data.acc;
    this.wpm         = data.wpm;
    this.sublevel    = data.sublevel;
    this.timeUsed    = data.timeUsed;
    this.typed       = data.typed;
    this.target      = data.target;
    this.correct     = data.correct;
    this.total       = data.total;
    this.initialTime = data.initialTime || 60;
    this.causa       = data.causa || 'tiempo'; // Por defecto asume derrota por tiempo
  }

  /**
   * create()
   * --------
   * Construye la pantalla de resultados sobre el fondo del ambiente activo.
   *
   * Estructura visual (de arriba hacia abajo):
   *   1. Fondo del ambiente (mismo color que PlayGame)
   *   2. Panel central semitransparente (500×380 px) con borde de color
   *   3. Ícono grande (🏆 / 💔 / ⏰) + título del resultado
   *   4. Etiqueta del subnivel y ambiente
   *   5. Línea divisoria
   *   6. Tabla de 5 métricas (filas alternadas con fondo oscuro)
   *   7. Línea divisoria
   *   8. Mensaje motivacional
   *   9. Botones de acción (generados con _makeBtn)
   */
  create() {
    const W = this.scale.width, H = this.scale.height;
    const amb = getAmbiente(this.sublevel);

    // Fondo de la escena con el color del ambiente correspondiente
    this.add.rectangle(W / 2, H / 2, W, H, amb.bgColor);

    // Panel central con borde verde (victoria) o rojo (derrota)
    const pW = 500, pH = 380;
    this.add.rectangle(W / 2, H / 2, pW, pH, 0x160800)
      .setStrokeStyle(2, this.won ? 0x44ff66 : 0xff4444);

    // ── Ícono y título del resultado ─────────────────────────────
    let icon, title, color;
    if (this.won) {
      icon = '🏆'; title = '¡COMPLETADO!'; color = '#44ff66';
    } else if (this.causa === 'vidas') {
      icon = '💔'; title = '¡SIN VIDAS!';  color = '#ff4444';
    } else {
      icon = '⏰'; title = 'TIEMPO AGOTADO'; color = '#ff8800';
    }

    this.add.text(W / 2, H / 2 - 158, icon,  { fontSize: '36px' }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 118, title, {
      fontSize: '30px', fill: color,
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Etiqueta de subnivel y ambiente
    this.add.text(W / 2, H / 2 - 85, `Subnivel ${this.sublevel} — ${amb.label}`, {
      fontSize: '14px', fill: amb.labelColor, fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Línea divisoria superior de la tabla
    this.add.rectangle(W / 2, H / 2 - 65, pW - 60, 1, 0x3a1500);

    // ── Tabla de 5 métricas ───────────────────────────────────────
    // Las filas pares (i%2===0) tienen fondo oscuro para diferenciarlas
    [
      ['⌛ Tiempo',    `${this.timeUsed}s de ${this.initialTime}s`], // Tiempo usado / máximo
      ['⚡ Velocidad', `${this.wpm} WPM`],                           // Palabras por minuto
      ['🎯 Precisión', `${this.acc}%`],                              // % de chars correctos
      ['✅ Correctas', `${this.correct} / ${this.total} letras`],    // Chars correctos / total
      ['💥 Errores',   `${this.total - this.correct} caracteres`],   // Chars incorrectos
    ].forEach(([lbl, val], i) => {
      const y = H / 2 - 40 + i * 38; // Espaciado vertical de 38 px por fila
      // Fondo oscuro en filas pares
      if (i % 2 === 0) this.add.rectangle(W / 2, y + 7, pW - 60, 30, 0x1e0c00).setOrigin(0.5);
      // Etiqueta izquierda (gris)
      this.add.text(W / 2 - 180, y, lbl, { fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New' });
      // Valor derecho (blanco, alineado a la derecha)
      this.add.text(W / 2 + 175, y, val, {
        fontSize: '14px', fill: '#fff',
        fontFamily: 'Courier New', fontStyle: 'bold'
      }).setOrigin(1, 0);
    });

    // Línea divisoria inferior de la tabla
    this.add.rectangle(W / 2, H / 2 + 112, pW - 60, 1, 0x3a1500);

    // ── Mensaje motivacional ──────────────────────────────────────
    const msg = this.won
      ? (this.acc >= 95 ? '¡Excelente precisión!' : 'Buen trabajo, mejora la precisión.')
      : (this.causa === 'vidas'
          ? '¡Cuidado con los errores! Vuelve a intentarlo.'
          : '¡Casi! Escribe más rápido.');

    this.add.text(W / 2, H / 2 + 128, msg, {
      fontSize: '12px', fill: '#888', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // ── Botones de acción ─────────────────────────────────────────
    // Si ganó y no es el último subnivel → 4 botones (con "Siguiente")
    // En cualquier otro caso → 3 botones
    const hasNext = this.won && this.sublevel < 20;
    const btnY    = H / 2 + 162;

    if (hasNext) {
      // Victoria con siguiente subnivel disponible: 4 botones
      this._makeBtn(W / 2 - 240, btnY, '↺ Reintentar', 0x5c1500, () => {
        // Vuelve a jugar el mismo subnivel (respeta tiempo especial de canciones)
        const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20[this.sublevel - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2 - 80, btnY, '☰ Subniveles', 0x1a3d00, () => this.scene.start('LevelSelect'));
      this._makeBtn(W / 2 + 80, btnY, `▶ Sub ${this.sublevel + 1}`, 0x1a5e8a, () => {
        // Avanza al siguiente subnivel con el tiempo correcto
        const next = this.sublevel + 1;
        const tl   = (next === 10 || next === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: next, word: words20[next - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2 + 240, btnY, '🏠 Menú', 0x1a1a1a, () => window.location.href = 'index1.html');
    } else {
      // Victoria en subnivel 20 o derrota: 3 botones (sin "Siguiente")
      this._makeBtn(W / 2 - 190, btnY, '↺ Reintentar', 0x5c1500, () => {
        const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20[this.sublevel - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2, btnY, '☰ Subniveles', 0x1a3d00, () => this.scene.start('LevelSelect'));
      this._makeBtn(W / 2 + 190, btnY, '🏠 Menú', 0x1a1a1a, () => window.location.href = 'index1.html');
    }
  }

  /**
   * _makeBtn(x, y, label, bg, cb, w)
   * ----------------------------------
   * Crea un botón interactivo en la escena Phaser.
   * Compuesto por:
   *  • Rectángulo de fondo con borde semitransparente y hover de opacidad
   *  • Texto centrado encima
   *
   * @param {number}   x     - Centro X del botón
   * @param {number}   y     - Centro Y del botón
   * @param {string}   label - Texto del botón
   * @param {number}   bg    - Color de fondo (hex)
   * @param {Function} cb    - Callback al hacer click
   * @param {number}   [w=140] - Ancho del botón en píxeles
   */
  _makeBtn(x, y, label, bg, cb, w = 140) {
    const btn = this.add.rectangle(x, y, w, 44, bg)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(1, 0xffffff33); // Borde blanco muy sutil
    this.add.text(x, y, label, {
      fontSize: '13px', fill: '#fff',
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setAlpha(0.75)); // Dimea al hover
    btn.on('pointerout',  () => btn.setAlpha(1));    // Restaura al salir
    btn.on('pointerdown', cb);                        // Ejecuta el callback
  }
}


// ===================================================
//  SECCIÓN 12: INICIALIZACIÓN DE PHASER
//
//  Crea la instancia principal del juego cuando el DOM
//  está completamente cargado (window.onload).
//
//  Configuración:
//    • type: AUTO → usa WebGL si está disponible, Canvas si no
//    • width/height: 1000×600 px (canvas lógico)
//    • parent: 'game-container' → div HTML donde se monta el canvas
//    • backgroundColor: '#1a0a00' → marrón muy oscuro (subsuelo)
//    • scene: orden de las escenas (Preload se ejecuta primero)
// ===================================================
window.onload = function () {
  new Phaser.Game({
    type:            Phaser.AUTO,  // WebGL con fallback a Canvas 2D
    width:           1000,         // Ancho lógico del canvas
    height:          600,          // Alto lógico del canvas
    parent:          'game-container', // ID del div contenedor en el HTML
    backgroundColor: '#1a0a00',    // Color de fondo antes de cargar la primera escena
    scene:           [Preload, LevelSelect, PlayGame, ResultScreen] // Pipeline de escenas
  });
};