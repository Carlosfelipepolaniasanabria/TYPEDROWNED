// ===================================================
//  nivel2.js — Nivel 2: Superficie  (estructura = nivel1)
//  CAMBIO: caminarPaso avanza 14px (igual que nivel1)
//  Mismos módulos: Personaje, SistemaVidas, BanderaColombia
//  Proporciones y layout idénticos al nivel1
// ===================================================

// ===================================================
//  CANCIONES — Nivel 2
// ===================================================
const song_n2_10 = `Estoy llorando en mi habitación
Todo se nubla a mi alrededor
Ella se fue con un niño pivo
En un Ford Fiesta blanco
Y un jersey amarillo

Por el parque les veo pasar
Cuando se besan lo paso fatal
Voy a vengarme de ese
Voy a llenarle el cuello
De polvos pica pica

Sufre mamón, devuélveme a mi chica
O te retorcerás entre polvos pica pica
Sufre mamón, devuélveme a mi chica
O te retorcerás entre polvos pica pica

Le he quemado su jersey
Se ha comprado cinco o seis
Voy a destrozarle el coche
Lo tengo preparado, voy esta noche

Te reirás nunca más de mi
Lo siento nene vas a morir
Tú me quitaste lo que más quería
Y volverá conmigo, volverá algún día

Sufre mamón, devuélveme a mi chica
O te retorcerás entre polvos pica pica
Sufre mamón, devuélveme a mi chica
O te retorcerás entre polvos pica pica`;

const song_n2_20 = `I found a love for me
Darling, just dive right in and follow my lead
I found a girl, beautiful and sweet
I never knew you were the someone waiting for me

Because we were just kids when we fell in love
Not knowing what it was
I will not give you up this time
Darling, just kiss me slow
Your heart is all I own
And in your eyes, you're holding mine

Baby I'm, dancing in the dark
With you between my arms
Barefoot on the grass
Listening to our favourite song
When you said you looked a mess
I whispered underneath my breath
But you heard it
Darling, you look perfect tonight

I found a woman, stronger than anyone I know
She shares my dreams, I hope that someday I'll share her home
I found a lover to carry more than just my secrets
To carry love, to carry children of our own

We are still kids, but we're so in love
Fighting against all odds
I know we'll be alright this time
Darling, just hold my hand
Be my girl, I'll be your man
I see my future in your eyes`;


// ===================================================
//  FRASES — Nivel 2
// ===================================================
const words20_n2 = [
    "El sujeto alcanza la superficie y examina un entorno urbano con múltiples estímulos visuales.",
    "Durante el desplazamiento inicial, identifica rutas seguras y selecciona zonas con menor congestión.",
    "El sistema de movimiento se ajusta a cambios de velocidad, dirección y densidad peatonal.",
    "Se detectan obstáculos estructurales; por ello, el avance requiere mayor precisión y control.",
    "La exposición al ruido constante reduce la concentración, aunque el objetivo principal se mantiene.",
    "El sujeto evalúa la estabilidad del terreno y prioriza superficies con menor riesgo de caída.",
    "Se utilizan estructuras elevadas para ampliar el campo visual y mejorar la orientación espacial.",
    "La complejidad del entorno terrestre aumenta, exigiendo decisiones rápidas y técnicamente correctas.",
    "Se identifica una ruta de ascenso que conecta la ciudad con capas superiores del entorno.",
    song_n2_10,
    "El sujeto inicia el ascenso y percibe una disminución progresiva de la presión atmosférica.",
    "La reducción de oxígeno modifica la respiración, el equilibrio y la estabilidad del movimiento.",
    "Corrientes de viento alteran la trayectoria y obligan a realizar correcciones constantes.",
    "La visibilidad cambia de forma gradual, por lo que la orientación depende de nuevas referencias.",
    "La gravedad reduce parcialmente su efecto y transforma la dinámica general del desplazamiento.",
    "El entorno aéreo exige adaptación continua a variables físicas, térmicas y espaciales.",
    "La coordinación corporal depende del control preciso de cada impulso y cada ajuste postural.",
    "Se presenta una transición entre capas atmosféricas acompañada de variaciones bruscas de temperatura.",
    "El sujeto conserva el objetivo y se aproxima finalmente al límite superior de la atmósfera.",
    song_n2_20
];


// ===================================================
//  DESBLOQUEO — Nivel 2
// ===================================================
function getUnlockedLevel_n2() {
  let u = localStorage.getItem('n2_max');
  if (!u) { u = 1; localStorage.setItem('n2_max', u); }
  return parseInt(u, 10);
}
function setUnlockedLevel_n2(level) {
  if (level > getUnlockedLevel_n2()) localStorage.setItem('n2_max', level);
}


// ===================================================
//  MÓDULO: VIDAS  (idéntico al nivel1)
// ===================================================
class SistemaVidas {
  constructor(scene, maxVidas = 4) {
    this.scene     = scene;
    this.maxVidas  = maxVidas;
    this.vidas     = maxVidas;
    this.corazones = [];
    this.bloqueado = false;
  }
  crear(x, y) {
    for (let i = 0; i < this.maxVidas; i++) {
      this.corazones.push(
        this.scene.add.text(x + i * 32, y, '❤️', { fontSize: '22px' }).setDepth(20)
      );
    }
  }
  perderVida(onMuerte) {
    if (this.bloqueado || this.vidas <= 0) return;
    this.bloqueado = true;
    this.vidas--;
    if (this.corazones[this.vidas]) this.corazones[this.vidas].setText('🖤');
    this.scene.time.delayedCall(600, () => {
      this.bloqueado = false;
      if (this.vidas <= 0 && onMuerte) onMuerte();
    });
  }
  sinVidas() { return this.vidas <= 0; }
  destruir() { this.corazones.forEach(c => c.destroy()); this.corazones = []; }
}


// ===================================================
//  MÓDULO: PERSONAJE  (colores superficie, avance 14px)
// ===================================================
class Personaje {
  constructor(scene) {
    this.scene     = scene;
    this.container = null;
    this.svg       = null;
    this.estado    = 'idle';
    this.x         = 60;
    this.maxX      = 320;
    this.minX      = 30;
    this.dañado    = false;
    this._crearEstilos();
    this._crearElemento();
  }

  _crearEstilos() {
    if (document.getElementById('personaje-humano-styles')) return;
    const style = document.createElement('style');
    style.id = 'personaje-humano-styles';
    style.textContent = `
      .personaje-wrap {
        position: fixed; bottom: 48px; left: 60px;
        z-index: 15; pointer-events: none;
        width: 90px; height: 150px;
        display: flex; align-items: flex-end; justify-content: center;
        transition: left 0.18s ease-out, transform 0.18s ease-out;
      }
      .personaje-shadow {
        position: absolute; bottom: 6px;
        width: 42px; height: 10px; border-radius: 50%;
        background: rgba(0,0,0,0.35); filter: blur(2px); transform: translateX(-2px);
      }
      .personaje-svg { width: 78px; height: 138px; overflow: visible; transform-origin: center bottom; }
      .personaje-svg.idle { animation: respirar 1.8s ease-in-out infinite; }
      @keyframes respirar {
        0%   { transform: translateY(0px) scaleY(1); }
        50%  { transform: translateY(-1px) scaleY(1.01); }
        100% { transform: translateY(0px) scaleY(1); }
      }
      .personaje-svg.walking .torso  { animation: torsoWalk  0.34s ease-in-out infinite alternate; transform-origin: center 58px; }
      .personaje-svg.walking .arm-left  { animation: armLeftWalk  0.34s ease-in-out infinite alternate; transform-origin: 28px 58px; }
      .personaje-svg.walking .arm-right { animation: armRightWalk 0.34s ease-in-out infinite alternate; transform-origin: 48px 58px; }
      .personaje-svg.walking .leg-left  { animation: legLeftWalk  0.34s ease-in-out infinite alternate; transform-origin: 35px 88px; }
      .personaje-svg.walking .leg-right { animation: legRightWalk 0.34s ease-in-out infinite alternate; transform-origin: 41px 88px; }
      .personaje-svg.walking .head-group { animation: headWalk 0.34s ease-in-out infinite alternate; transform-origin: center 26px; }
      @keyframes torsoWalk   { 0% { transform: translateY(0px) rotate(-1deg); } 100% { transform: translateY(-2px) rotate(1deg); } }
      @keyframes headWalk    { 0% { transform: translateY(0px); } 100% { transform: translateY(-2px); } }
      @keyframes armLeftWalk  { 0% { transform: rotate(24deg); }  100% { transform: rotate(-18deg); } }
      @keyframes armRightWalk { 0% { transform: rotate(-18deg); } 100% { transform: rotate(24deg); } }
      @keyframes legLeftWalk  { 0% { transform: rotate(20deg); }  100% { transform: rotate(-16deg); } }
      @keyframes legRightWalk { 0% { transform: rotate(-16deg); } 100% { transform: rotate(20deg); } }
      .personaje-svg.hurt { animation: hurtShake 0.45s ease; filter: drop-shadow(0 0 10px rgba(255,60,60,0.9)); }
      .personaje-wrap.hurt-wrap { transform: translateX(-10px) rotate(-8deg); }
      @keyframes hurtShake {
        0% { transform: translateX(0px) rotate(0deg); } 20% { transform: translateX(-5px) rotate(-6deg); }
        40% { transform: translateX(6px) rotate(6deg); }  60% { transform: translateX(-4px) rotate(-4deg); }
        80% { transform: translateX(3px) rotate(3deg); }  100% { transform: translateX(0px) rotate(0deg); }
      }
      .personaje-svg.victoria { animation: victoryJump 0.6s ease-in-out infinite alternate; filter: drop-shadow(0 0 12px rgba(120,255,160,0.95)); }
      @keyframes victoryJump { 0% { transform: translateY(0px) scale(1); } 100% { transform: translateY(-12px) scale(1.04); } }
      .personaje-exclamacion {
        position: absolute; top: -26px; left: 50%;
        transform: translateX(-50%); font-size: 24px;
        opacity: 0; animation: flotarIcono 0.8s ease forwards; pointer-events: none;
      }
      @keyframes flotarIcono {
        0%   { opacity: 1; transform: translateX(-50%) translateY(0px) scale(0.9); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-22px) scale(1.12); }
      }
    `;
    document.head.appendChild(style);
  }

  _crearElemento() {
    this.container = document.createElement('div');
    this.container.className = 'personaje-wrap';
    this.container.id = 'personaje-wrap';
    // Outfit superficie (colores sin cambio)
    const outfit = { shirt: '#66c46d', pants: '#d9f2da', skin: '#f0c7a8', shoe: '#b8ffb8' };
    this.container.innerHTML = `
      <div class="personaje-shadow"></div>
      <svg class="personaje-svg idle" id="personaje-svg" viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg">
        <g class="head-group">
          <ellipse cx="40" cy="20" rx="12" ry="14" fill="${outfit.skin}" />
          <path d="M28 17 Q40 2 52 17 L52 13 Q40 -1 28 13 Z" fill="#2b1b14"/>
          <circle cx="36" cy="19" r="1.4" fill="#23150f"/>
          <circle cx="44" cy="19" r="1.4" fill="#23150f"/>
          <path d="M36 26 Q40 29 44 26" stroke="#7a3f32" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <rect x="37" y="33" width="6" height="5" rx="2" fill="${outfit.skin}" />
        </g>
        <g class="torso">
          <path d="M28 40 Q40 34 52 40 L54 70 Q40 76 26 70 Z" fill="${outfit.shirt}" />
          <rect x="33" y="70" width="14" height="18" rx="5" fill="${outfit.pants}" />
        </g>
        <g class="arm-left">
          <rect x="24" y="44" width="7" height="24" rx="4" fill="${outfit.skin}" transform="rotate(18 28 44)" />
          <circle cx="21" cy="68" r="3.5" fill="${outfit.skin}" />
        </g>
        <g class="arm-right">
          <rect x="49" y="44" width="7" height="24" rx="4" fill="${outfit.skin}" transform="rotate(-18 52 44)" />
          <circle cx="59" cy="68" r="3.5" fill="${outfit.skin}" />
        </g>
        <g class="leg-left">
          <rect x="31" y="86" width="8" height="30" rx="4" fill="${outfit.pants}" />
          <ellipse cx="35" cy="119" rx="7" ry="3.8" fill="${outfit.shoe}" />
        </g>
        <g class="leg-right">
          <rect x="41" y="86" width="8" height="30" rx="4" fill="${outfit.pants}" />
          <ellipse cx="45" cy="119" rx="7" ry="3.8" fill="${outfit.shoe}" />
        </g>
      </svg>
    `;
    document.body.appendChild(this.container);
    this.svg = document.getElementById('personaje-svg');
    this._aplicarPosicion();
  }

  _aplicarPosicion() { if (this.container) this.container.style.left = `${this.x}px`; }

  _setEstado(nuevo) {
    if (!this.svg) return;
    this.svg.classList.remove('idle', 'walking', 'hurt', 'victoria');
    this.svg.classList.add(nuevo);
    this.estado = nuevo;
  }

  idle() { if (this.dañado) return; this._setEstado('idle'); }

  // avance 14px — igual que nivel1
  caminarPaso() {
    if (!this.svg || this.dañado) return;
    this._setEstado('walking');
    this.x = Math.min(this.maxX, this.x + 14);
    this._aplicarPosicion();
    clearTimeout(this._walkTimeout);
    this._walkTimeout = setTimeout(() => { if (!this.dañado) this.idle(); }, 220);
  }

  animarDaño() {
    if (!this.svg || this.dañado) return;
    this.dañado = true;
    this._setEstado('hurt');
    this.container.classList.add('hurt-wrap');
    this.x = Math.max(this.minX, this.x - 18);
    this._aplicarPosicion();
    const exc = document.createElement('div');
    exc.className = 'personaje-exclamacion'; exc.textContent = '🤕';
    this.container.appendChild(exc);
    setTimeout(() => exc.remove(), 800);
    setTimeout(() => {
      if (this.container) this.container.classList.remove('hurt-wrap');
      if (this.svg) this.idle();
      this.dañado = false;
    }, 500);
  }

  animarVictoria() {
    if (!this.svg) return;
    this._setEstado('victoria');
    const exc = document.createElement('div');
    exc.className = 'personaje-exclamacion'; exc.textContent = '⭐';
    this.container.appendChild(exc);
    setTimeout(() => exc.remove(), 800);
  }

  destruir() {
    clearTimeout(this._walkTimeout);
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
  }
}


// ===================================================
//  MÓDULO: BANDERA  (idéntico al nivel1)
// ===================================================
class BanderaColombia {
  constructor() { this.el = null; this._crearEstilos(); }

  _crearEstilos() {
    if (document.getElementById('bandera-styles')) return;
    const style = document.createElement('style');
    style.id = 'bandera-styles';
    style.textContent = `
      .bandera-overlay { position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.72);z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fadeInBandera 0.4s ease;pointer-events:none; }
      @keyframes fadeInBandera { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
      .bandera-colombia { width:200px;height:120px;border-radius:6px;overflow:hidden;box-shadow:0 0 40px rgba(255,220,0,0.5);display:flex;flex-direction:column;margin-bottom:20px;animation:ondeaBandera 1s ease-in-out infinite alternate; }
      @keyframes ondeaBandera { 0%{transform:rotate(-2deg)scale(1);} 100%{transform:rotate(2deg)scale(1.04);} }
      .bandera-amarillo{flex:2;background:#FCD116;} .bandera-azul{flex:1;background:#003087;} .bandera-rojo{flex:1;background:#CE1126;}
      .bandera-texto { font-family:'Courier New',monospace;font-size:22px;font-weight:bold;color:#FFD700;text-shadow:0 0 15px rgba(255,215,0,0.8);margin-top:10px;letter-spacing:3px; }
      .bandera-sub { font-family:'Courier New',monospace;font-size:14px;color:#aaa;margin-top:6px; }
    `;
    document.head.appendChild(style);
  }

  mostrar(sublevel, onDone, duracion = 2200) {
    this.el = document.createElement('div');
    this.el.className = 'bandera-overlay';
    this.el.innerHTML = `
      <div class="bandera-colombia">
        <div class="bandera-amarillo"></div><div class="bandera-azul"></div><div class="bandera-rojo"></div>
      </div>
      <div class="bandera-texto">¡SUBNIVEL ${sublevel} COMPLETADO!</div>
      <div class="bandera-sub">🇨🇴 ¡Colombia presente! 🇨🇴</div>
    `;
    document.body.appendChild(this.el);
    setTimeout(() => { this.destruir(); if (onDone) onDone(); }, duracion);
  }

  destruir() {
    if (this.el && this.el.parentNode) { this.el.parentNode.removeChild(this.el); this.el = null; }
  }
}


// ===================================================
//  PRELOAD
// ===================================================
class Preload extends Phaser.Scene {
  constructor() { super({ key: 'Preload' }); }
  preload() {
    this.load.audio('n2_song1', '../assets/audio/cancion3.mp3');
    this.load.audio('n2_song2', '../assets/audio/cancion4.mp3');
  }
  create() { this.scene.start('LevelSelect'); }
}


// ===================================================
//  ESCENA: SELECTOR DE SUBNIVELES
// ===================================================
class LevelSelect extends Phaser.Scene {
  constructor() { super({ key: 'LevelSelect' }); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    const unlocked = getUnlockedLevel_n2();

    document.querySelectorAll('.typing-overlay, #personaje-wrap, .bandera-overlay').forEach(el => el.remove());

    // Mismo fondo que nivel1 pero color superficie
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a1a00);

    this.add.text(W / 2, 38, 'NIVEL 2 — SUPERFICIE', {
      fontSize: '26px', fill: '#7ecf5a',
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, 68, 'Completa frases para avanzar • 4 vidas por subnivel', {
      fontSize: '13px', fill: '#3a7a10', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(W / 2, 88, 'Objetivo: 50 WPM • Selecciona un subnivel', {
      fontSize: '13px', fill: '#555', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    const menuBtn = this.add.text(20, 12, '← Menú', {
      fontSize: '15px', fill: '#aaa', fontFamily: 'Courier New'
    }).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#fff' }));
    menuBtn.on('pointerout',  () => menuBtn.setStyle({ fill: '#aaa' }));
    menuBtn.on('pointerdown', () => window.location.href = 'index1.html');

    // Mismas proporciones de grid que nivel1
    const cols = 5, cardW = 145, cardH = 78, gapX = 26, gapY = 26;
    const gridWidth = cols * cardW + (cols - 1) * gapX;
    const startX    = (W - gridWidth) / 2 + cardW / 2;
    const startY    = 165 + cardH / 2;

    for (let i = 0; i < 20; i++) {
      const sublevel    = i + 1;
      const col         = i % cols;
      const row         = Math.floor(i / cols);
      const x           = startX + col * (cardW + gapX);
      const y           = startY + row * (cardH + gapY);
      const isActive    = sublevel <= unlocked;
      const isSong      = sublevel === 10 || sublevel === 20;
      const bgColor     = isActive ? (isSong ? 0x4d2200 : 0x2d6e1a) : 0x2a2a2a;
      const txtColor    = isActive ? '#ffffff' : '#555555';
      const strokeColor = isActive ? (isSong ? 0xff8833 : 0x55cc33) : 0x444444;
      const hoverColor  = isSong ? 0x6e3300 : 0x3d9e25;
      const playColor   = isActive ? (isSong ? '#ffaa55' : '#88ff66') : '#444';

      const btn = this.add.rectangle(x, y, cardW, cardH, bgColor).setStrokeStyle(3, strokeColor);

      if (isActive) {
          btn.setInteractive({ useHandCursor: true });
          btn.on('pointerover', () => btn.setFillStyle(0x3d9e25));
          btn.on('pointerout',  () => btn.setFillStyle(bgColor));
          btn.on('pointerdown', () => {
              this.scene.start('PlayGame', { sublevel: i + 1, word: words20_n2[i] });
          });
      } else {
          btn.setInteractive({ useHandCursor: true });
          btn.on('pointerover', () => btn.setFillStyle(0x3a3a3a));
          btn.on('pointerout',  () => btn.setFillStyle(bgColor));
          btn.on('pointerdown', () => this.showLockedMessage(i + 1));
      }

      this.add.text(x, y - 16, `Sub ${sublevel}`, {
        fontSize: '16px', fill: txtColor,
        fontFamily: 'Oxanium, sans-serif', fontStyle: '700'
      }).setOrigin(0.5);

      this.add.text(x, y + 4, 'SUPERFICIE', {
        fontSize: '10px', fill: isActive ? '#7ecf5a' : '#444', fontFamily: 'Courier New'
      }).setOrigin(0.5);

      this.add.text(x, y + 22, isActive ? (isSong ? '🎵' : '▶') : '🔒', {
        fontSize: '14px', fill: playColor, fontFamily: 'Courier New'
      }).setOrigin(0.5);
    }
  }

  showLockedMessage(sublevelNum) {
    // Evita apilar mensajes si ya hay uno visible
    if (this._lockMsg) return;

    const W = this.scale.width;
    const H = this.scale.height;

    const bg = this.add.rectangle(W / 2, H - 90, 480, 52, 0x1a0a00)
        .setStrokeStyle(2, 0xcc4400)
        .setDepth(20);

    const icon = this.add.text(W / 2 - 210, H - 90, '🔒', {
        fontSize: '18px'
    }).setOrigin(0, 0.5).setDepth(20);

    const msg = this.add.text(W / 2 - 180, H - 90,
        `Completa el subnivel ${sublevelNum - 1} primero`, {
        fontSize: '14px', fill: '#e8a060',
        fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(20);

    this._lockMsg = [bg, icon, msg];

    // Espera 2s visible, luego desvanece en 1s
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
//  ESCENA: JUEGO
// ===================================================
class PlayGame extends Phaser.Scene {
  constructor() { super({ key: 'PlayGame' }); }

  init(data) {
    this.sublevel     = data.sublevel || 1;
    this.isSongLevel  = this.sublevel === 10 || this.sublevel === 20;
    this.targetText   = this.isSongLevel
      ? (data.word || '').replace(/\n+/g, ' ').trim()
      : (data.word || '');
    this.typed        = '';
    this.lastTypedLen = 0;
    this.timeLeft     = data.timeLimit || 60;
    this.initialTime  = this.timeLeft;
    this.finished     = false;
    this.timerStarted = false;
    this.startTime    = null;
    this.timerEvent   = null;
    this.overlay      = null;
    this.inputEl      = null;
    this.phraseEl     = null;
    this.scrollBox    = null;
    this.music        = null;
    this.musicEnabled = true;
    this.personaje    = null;
    this.sistemaVidas = null;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Fondo superficie
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a1a00);
    const g = this.add.graphics();
    g.fillStyle(0x224400, 0.5);
    g.fillRect(0, H - 50, W, 50);
    g.fillStyle(0xffffff, 0.08);
    [150, 350, 600, 820].forEach(cx => {
      g.fillEllipse(cx, 130, 120, 40);
      g.fillEllipse(cx + 40, 120, 90, 35);
    });

    this.add.text(W / 2, 28, `SUBNIVEL ${this.sublevel} — SUPERFICIE | Meta: 50 WPM`, {
      fontSize: '18px', fill: '#7ecf5a',
      fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    const back = this.add.text(16, 12, '← Volver', {
      fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New'
    }).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
    back.on('pointerout',  () => back.setStyle({ fill: '#aaa' }));
    back.on('pointerdown', () => { this._stopMusic(); this._cleanup(); this.scene.start('LevelSelect'); });

    this.timerPhaserText = this.add.text(W - 16, 12, '⏱ Escribe para iniciar', {
      fontSize: '15px', fill: '#888', fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(1, 0);

    if (this.isSongLevel) {
      const soundBtn = this.add.text(W - 110, 12, '🔊', {
        fontSize: '20px', fill: '#ffdd55', fontFamily: 'Courier New'
      }).setInteractive({ useHandCursor: true });
      soundBtn.on('pointerdown', () => {
        this.musicEnabled = !this.musicEnabled;
        soundBtn.setText(this.musicEnabled ? '🔊' : '🔇');
        if (this.music) { this.musicEnabled ? this.music.resume() : this.music.pause(); }
      });
    }

    this.wpmPhaserText = this.add.text(16, 38, 'WPM: 0', {
      fontSize: '14px', fill: '#66ccff', fontFamily: 'Courier New'
    });
    this.accPhaserText = this.add.text(16, 58, 'Precisión: 100%', {
      fontSize: '14px', fill: '#aaffaa', fontFamily: 'Courier New'
    });

    this.add.text(W - 16, 38, '🎯 Meta: 50 WPM', {
      fontSize: '13px', fill: '#4a8a30', fontFamily: 'Courier New'
    }).setOrigin(1, 0);

    this.add.text(W / 2, 85, 'Escribe la frase exactamente como aparece:', {
      fontSize: '12px', fill: '#555', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Barra de progreso — mismas proporciones que nivel1
    this.add.rectangle(W / 2, H - 28, W - 60, 14, 0x1a2a1a).setOrigin(0.5);
    this.progressBar  = this.add.rectangle(30, H - 28, 2, 10, 0x2d6e1a).setOrigin(0, 0.5);
    this.progressMaxW = W - 60;
    this.progressPct  = this.add.text(W / 2, H - 28, '0%', {
      fontSize: '10px', fill: '#666', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.hintText = this.add.text(W / 2, H - 60, '🖱 Haz clic en la pantalla para escribir', {
      fontSize: '12px', fill: '#333', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Vidas — misma posición que nivel1
    this.sistemaVidas = new SistemaVidas(this, 4);
    this.sistemaVidas.crear(W / 2 - 56, 36);

    // Personaje
    this.personaje = new Personaje(this);

    this._buildHTMLOverlay(W, H);

    if (this.isSongLevel) {
      const audioKey = this.sublevel === 10 ? 'n2_song1' : 'n2_song2';
      if (this.cache.audio.exists(audioKey)) {
        this.music = this.sound.add(audioKey, { loop: false, volume: 0.5 });
      }
    }
  }

  _buildHTMLOverlay(W, H) {
    const canvas    = this.game.canvas;
    const rect      = canvas.getBoundingClientRect();
    const scaleX    = rect.width / W;
    const scaleFont = Math.min(scaleX, 1.2);

    this.overlay = document.createElement('div');
    this.overlay.className = 'typing-overlay';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: rect.top + 'px', left: rect.left + 'px',
      width: rect.width + 'px', height: rect.height + 'px',
      pointerEvents: 'none', zIndex: '10',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: `${Math.round(170 * scaleX)}px`
    });

    this.scrollBox = document.createElement('div');
    Object.assign(this.scrollBox.style, {
      background: 'rgba(4,12,4,0.82)',
      border: '2px solid #2a7a30',
      borderRadius: '18px', padding: '28px 34px',
      maxWidth: `${Math.round(1100 * scaleX)}px`, width: '95%',
      minHeight: `${Math.round(260 * scaleX)}px`,
      height:    this.isSongLevel ? `${Math.round(460 * scaleX)}px` : `${Math.round(260 * scaleX)}px`,
      maxHeight: this.isSongLevel ? `${Math.round(460 * scaleX)}px` : `${Math.round(260 * scaleX)}px`,
      overflow: 'hidden', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 30px rgba(40,255,120,0.12), inset 0 0 28px rgba(0,0,0,0.45)'
    });

    this.phraseEl = document.createElement('div');
    Object.assign(this.phraseEl.style, {
      fontFamily: '"Oxanium","Orbitron",sans-serif',
      fontSize: this.isSongLevel ? `${Math.round(22 * scaleFont)}px` : `${Math.round(30 * scaleFont)}px`,
      lineHeight: '1.6', textAlign: 'center',
      letterSpacing: '1.2px', wordBreak: 'break-word',
      overflowWrap: 'break-word', whiteSpace: 'pre-wrap',
      userSelect: 'none', color: '#effff1',
      width: '100%', maxWidth: '100%',
      padding: '0 10px', margin: '0 auto',
      transform: 'translateY(0px)', transition: 'transform 0.08s linear'
    });

    this._renderPhrase();
    this.scrollBox.appendChild(this.phraseEl);
    this.overlay.appendChild(this.scrollBox);

    this.inputEl = document.createElement('input');
    Object.assign(this.inputEl.style, {
      position: 'fixed', top: '-9999px', left: '-9999px',
      opacity: '0', width: '1px', height: '1px',
      border: 'none', outline: 'none', pointerEvents: 'all'
    });
    this.inputEl.setAttribute('autocomplete', 'off');
    this.inputEl.setAttribute('autocorrect', 'off');
    this.inputEl.setAttribute('autocapitalize', 'none');
    this.inputEl.setAttribute('spellcheck', 'false');
    this.inputEl.addEventListener('input',   () => this._onInput());
    this.inputEl.addEventListener('paste',   e  => e.preventDefault());
    this.inputEl.addEventListener('keydown', e  => { if (this.finished) e.preventDefault(); });

    this.overlay.appendChild(this.inputEl);
    document.body.appendChild(this.overlay);
    setTimeout(() => this.inputEl.focus(), 150);
    this.game.canvas.addEventListener('click', () => this.inputEl.focus());
  }

  _renderPhrase() {
    const target = this.targetText, typed = this.typed;
    let html = '';
    for (let i = 0; i < target.length; i++) {
      const ch = target[i], display = ch === ' ' ? '&nbsp;' : ch;
      if (i < typed.length) {
        html += typed[i] === target[i]
          ? `<span style="color:#44ff66">${display}</span>`
          : ch === ' '
            ? `<span style="color:#ff4444;text-decoration:underline">&nbsp;</span>`
            : `<span style="color:#ff4444;background:rgba(255,0,0,0.12)">${display}</span>`;
      } else if (i === typed.length) {
        html += `<span style="color:#fff;border-bottom:2px solid #7ecf5a;padding-bottom:1px">${display}</span>`;
      } else {
        html += `<span style="color:#3a4a3a">${display}</span>`;
      }
    }
    this.phraseEl.innerHTML = html;

    if (this.isSongLevel && this.scrollBox && this.phraseEl) {
      const maxMove = Math.max(0, this.phraseEl.scrollHeight - this.scrollBox.clientHeight);
      let progress  = this.music && this.music.isPlaying && this.music.duration > 0
        ? Math.max(0, this.music.seek - 10) / Math.max(1, this.music.duration - 10)
        : (target.length > 0 ? typed.length / target.length : 0);
      progress = Phaser.Math.Clamp(progress, 0, 1);
      this.phraseEl.style.transform = `translateY(-${maxMove * progress * 0.45}px)`;
    }
  }

  _onInput() {
    if (this.finished) return;
    let raw = this.inputEl.value;
    if (this.isSongLevel) { raw = raw.replace(/\n+/g, ' ').trimStart(); this.inputEl.value = raw; }
    if (raw.length > this.targetText.length) { raw = raw.slice(0, this.targetText.length); this.inputEl.value = raw; }

    if (!this.timerStarted && raw.length > 0) {
      this.timerStarted = true;
      this.startTime    = Date.now();
      this.timerPhaserText.setText(`⏱ ${this.initialTime}s`);
      this.timerPhaserText.setStyle({ fill: '#ffdd55', fontSize: '18px' });
      this.hintText.setVisible(false);
      this.timerEvent = this.time.addEvent({
        delay: 1000, loop: true, callback: this._tickTimer, callbackScope: this
      });
      if (this.isSongLevel && this.music && this.musicEnabled) this.music.play();
    }

    const escribiendo = raw.length > this.lastTypedLen;
    if (escribiendo) {
      const pos = raw.length - 1;
      if (raw[pos] === this.targetText[pos]) { this.personaje.caminarPaso(); }
      else { this._registrarError(); }
    } else {
      this.personaje.idle();
    }

    this.typed        = raw;
    this.lastTypedLen = raw.length;
    this._renderPhrase();
    this._updateStats();

    if (this.typed === this.targetText) this._endGame(true);
  }

  _registrarError() {
    this.personaje.animarDaño();
    this.cameras.main.flash(180, 255, 0, 0, false);
    this.sistemaVidas.perderVida(() => { this._perderSubnivel(); });
  }

  _perderSubnivel() {
    if (this.finished) return;
    this.finished = true;
    if (this.timerEvent) this.timerEvent.remove();
    this._stopMusic();
    this.cameras.main.shake(400, 0.018);
    this.cameras.main.flash(400, 255, 0, 0);
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

  _updateStats() {
    const typed = this.typed, target = this.targetText;
    const pct = typed.length / target.length;
    this.progressBar.width = Math.max(2, this.progressMaxW * pct);
    this.progressPct.setText(Math.round(pct * 100) + '%');

    if (this.startTime) {
      const mins  = (Date.now() - this.startTime) / 60000;
      const words = typed.trim().split(/\s+/).filter(Boolean).length;
      const wpm   = mins > 0 ? Math.round(words / mins) : 0;
      this.wpmPhaserText.setText(`WPM: ${wpm}`);
      this.wpmPhaserText.setStyle({ fill: wpm >= 50 ? '#44ff66' : wpm >= 35 ? '#ffdd55' : '#66ccff' });
    }

    let correct = 0;
    for (let i = 0; i < typed.length; i++) { if (typed[i] === target[i]) correct++; }
    this.accPhaserText.setText(`Precisión: ${typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100}%`);
  }

  _tickTimer() {
    if (this.finished) return;
    this.timeLeft--;
    this.timerPhaserText.setText(`⏱ ${this.timeLeft}s`);
    if      (this.timeLeft <= 10) this.timerPhaserText.setStyle({ fill: '#ff4444' });
    else if (this.timeLeft <= 20) this.timerPhaserText.setStyle({ fill: '#ffaa00' });
    if (this.isSongLevel) this._renderPhrase();
    if (this.timeLeft <= 0) this._endGame(false);
  }

  _stopMusic() {
    if (this.music) { this.music.stop(); this.music.destroy(); this.music = null; }
  }

  _endGame(won) {
    if (this.finished) return;
    this.finished = true;
    if (this.timerEvent) this.timerEvent.remove();
    this._stopMusic();

    const typed = this.typed, target = this.targetText;
    let   correct = 0;
    for (let i = 0; i < typed.length; i++) { if (typed[i] === target[i]) correct++; }

    const acc      = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
    const elapsed  = this.startTime ? (Date.now() - this.startTime) / 60000 : 1/60;
    const words    = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm      = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const timeUsed = this.initialTime - this.timeLeft;

    if (won) {
      if (this.sublevel < 20) setUnlockedLevel_n2(this.sublevel + 1);
      if (this.personaje) this.personaje.animarVictoria();
      this._cleanup();
      const bandera = new BanderaColombia();
      bandera.mostrar(this.sublevel, () => {
        this.scene.start('ResultScreen', {
          won, acc, wpm, typed, target,
          sublevel: this.sublevel, timeUsed, correct,
          total: target.length, initialTime: this.initialTime
        });
      }, 2400);
    } else {
      this._cleanup();
      this.scene.start('ResultScreen', {
        won, acc, wpm, typed, target,
        sublevel: this.sublevel, timeUsed, correct,
        total: target.length, initialTime: this.initialTime, causa: 'tiempo'
      });
    }
  }

  _cleanup() {
    this._stopMusic();
    if (this.personaje)    { this.personaje.destruir();   this.personaje = null; }
    if (this.sistemaVidas) { this.sistemaVidas.destruir(); this.sistemaVidas = null; }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay); this.overlay = null;
    }
    document.querySelectorAll('.bandera-overlay').forEach(el => el.remove());
  }

  shutdown() { this._cleanup(); }
  destroy()  { this._cleanup(); }
}


// ===================================================
//  ESCENA: RESULTADOS  (idéntica en layout al nivel1)
// ===================================================
class ResultScreen extends Phaser.Scene {
  constructor() { super({ key: 'ResultScreen' }); }

  init(data) {
    this.won = data.won; this.acc = data.acc; this.wpm = data.wpm;
    this.sublevel = data.sublevel; this.timeUsed = data.timeUsed;
    this.typed = data.typed; this.target = data.target;
    this.correct = data.correct; this.total = data.total;
    this.initialTime = data.initialTime || 60;
    this.causa = data.causa || 'tiempo';
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.add.rectangle(W / 2, H / 2, W, H, 0x030a00);

    const pW = 500;
    this.add.rectangle(W / 2, H / 2, pW, 380, 0x081400)
      .setStrokeStyle(2, this.won ? 0x44ff66 : 0xff4444);

    const metaOk = this.wpm >= 50;
    let icon, title, color;
    if (this.won && metaOk)            { icon = '🏆'; title = '¡COMPLETADO!';   color = '#44ff66'; }
    else if (this.won && !metaOk)      { icon = '✅'; title = '¡FRASE COMPLETA!'; color = '#ffdd55'; }
    else if (this.causa === 'vidas')   { icon = '💔'; title = '¡SIN VIDAS!';     color = '#ff4444'; }
    else                               { icon = '⏰'; title = 'TIEMPO AGOTADO';  color = '#ff8800'; }

    this.add.text(W / 2, H / 2 - 158, icon, { fontSize: '36px' }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 118, title, {
      fontSize: '30px', fill: color, fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 85, `Subnivel ${this.sublevel} — Superficie`, {
      fontSize: '14px', fill: '#7ecf5a', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 68,
      `${this.wpm} WPM ${metaOk ? '✓ Meta alcanzada' : '✗ Meta: 50 WPM'}`, {
        fontSize: '13px', fill: metaOk ? '#44ff66' : '#ff8844',
        fontFamily: 'Courier New', fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    this.add.rectangle(W / 2, H / 2 - 52, pW - 60, 1, 0x1a3a00);

    [
      ['⌛ Tiempo',    `${this.timeUsed}s de ${this.initialTime}s`],
      ['⚡ Velocidad', `${this.wpm} WPM`],
      ['🎯 Precisión', `${this.acc}%`],
      ['✅ Correctas', `${this.correct} / ${this.total} letras`],
      ['💥 Errores',   `${this.total - this.correct} caracteres`],
    ].forEach(([lbl, val], i) => {
      const y = H / 2 - 30 + i * 36;
      if (i % 2 === 0) this.add.rectangle(W / 2, y + 7, pW - 60, 28, 0x0e1e00).setOrigin(0.5);
      this.add.text(W / 2 - 180, y, lbl, { fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New' });
      this.add.text(W / 2 + 175, y, val, {
        fontSize: '14px', fill: '#fff', fontFamily: 'Courier New', fontStyle: 'bold'
      }).setOrigin(1, 0);
    });

    this.add.rectangle(W / 2, H / 2 + 110, pW - 60, 1, 0x1a3a00);

    const msg = this.won
      ? (metaOk ? '¡Excelente precisión!' : 'Completo, pero mejora la velocidad.')
      : (this.causa === 'vidas' ? '¡Cuidado con los errores!' : '¡Casi! Escribe más rápido.');
    this.add.text(W / 2, H / 2 + 126, msg, {
      fontSize: '12px', fill: '#888', fontFamily: 'Courier New'
    }).setOrigin(0.5);

    const hasNext = this.won && this.sublevel < 20;
    const btnY    = H / 2 + 160;

    if (hasNext) {
      this._makeBtn(W / 2 - 240, btnY, '↺ Reintentar', 0x1a3d00, () => {
        const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20_n2[this.sublevel - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2 - 80, btnY, '☰ Subniveles', 0x0d2600, () => this.scene.start('LevelSelect'));
      this._makeBtn(W / 2 + 80, btnY, `▶ Sub ${this.sublevel + 1}`, 0x1a5e2a, () => {
        const next = this.sublevel + 1;
        const tl   = (next === 10 || next === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: next, word: words20_n2[next - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2 + 240, btnY, '🏠 Menú', 0x1a1a1a, () => window.location.href = 'index1.html');
    } else {
      this._makeBtn(W / 2 - 190, btnY, '↺ Reintentar', 0x1a3d00, () => {
        const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
        this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20_n2[this.sublevel - 1], timeLimit: tl });
      });
      this._makeBtn(W / 2, btnY, '☰ Subniveles', 0x0d2600, () => this.scene.start('LevelSelect'));
      this._makeBtn(W / 2 + 190, btnY, '🏠 Menú', 0x1a1a1a, () => window.location.href = 'index1.html');
    }
  }

  _makeBtn(x, y, label, bg, cb, w = 140) {
    const btn = this.add.rectangle(x, y, w, 44, bg)
      .setInteractive({ useHandCursor: true }).setStrokeStyle(1, 0xffffff33);
    this.add.text(x, y, label, {
      fontSize: '13px', fill: '#fff', fontFamily: 'Courier New', fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setAlpha(0.75));
    btn.on('pointerout',  () => btn.setAlpha(1));
    btn.on('pointerdown', cb);
  }
}


// ===================================================
//  INICIAR PHASER
// ===================================================
window.onload = function () {
  new Phaser.Game({
    type:            Phaser.AUTO,
    width:           1000,
    height:          600,
    parent:          'game-container',
    backgroundColor: '#0a1a00',
    scene:           [Preload, LevelSelect, PlayGame, ResultScreen]
  });
};