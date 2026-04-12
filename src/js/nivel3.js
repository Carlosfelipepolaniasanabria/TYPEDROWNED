// ===================================================
//  nivel3.js — Nivel 3: Luna
//  Objetivo: 70 WPM
//  Modo GOD:
//  - progreso guardado en localStorage
//  - subniveles 10 y 20 son canciones
//  - scroll automático del texto
//  - sonido con Phaser
//  - botón activar / desactivar sonido
// ===================================================


// ===================================================
//  CANCIONES
//  Pega aquí la letra de cada canción.
//  No borres las comillas invertidas ` `
// ===================================================
/* const song_n3_10 = `En modo de defensa estoy
No creo más en el amor
Si lo hago, sé que soy
Como un ataque al corazón

Nunca entregaría todo mi amor
Y a la chica correcta, digo no
Puedo conseguir lo que quiera hoy
Si se trata de ti, nada tengo yo

Si fuera alguien más
Y con el corazón herido
Podría jugar
Todo un partido de basquetbol

Por ti
Soy como una niña que hoy
Pide suplicando más de ti
Por ti
Tu mano sostener
No soltarla nunca más

Me haces brillar
Y lo estoy tratando de ocultar

Sé que en modo de defensa estoy
No creo más en el amor
Si lo hago, sé que soy
Como un ataque al corazón
Como un ataque al corazón
Como un ataque al corazón

Nunca había llorado por nadie más
Quedo paralizado si te acercas
Y cuando intento ser más natural
Parece como si rogara ayuda

Y ya, no es justo ver
Tus problemas me quieres ceder
Respiro tu aire
Me quema, pero se siente tan bien

Por ti
Soy como una niña que hoy
Pide suplicando más de ti
Por ti
Tu mano sostener
No soltarla nunca más

Me haces brillar
Y lo estoy tratando de ocultar

Sé que en modo de defensa estoy
No creo más en el amor
Si lo hago, sé que soy
Como un ataque al corazón
Como un ataque al corazón
Como un ataque al corazón

Todos los sentimientos de ayer
Se han marchado y no me rendiré
No hay ningún culpable, yeah (no hay culpable)
Sé que nunca me alejaré
Cerca del Sol, siempre te amaré
Solo a mí cúlpame

Me haces brillar
Y lo estoy tratando de ocultar

Sé que en modo de defensa estoy
No creo más en el amor
Si lo hago, sé que soy
Como un ataque al corazón
Como un ataque al corazón (al corazón)
Como un ataque al corazón

Como un ataque al corazón
Como un ataque al corazón`;
 */

const song_n3_10 = `h`;

const song_n3_20 = `I still remember third of December, me in your sweater
You said it looked better on me than it did you
Only if you knew how much I liked you
But I watch your eyes as she

Walks by
What a sight for sore eyes, brighter than a blue sky
She's got you mesmerized while I die

Why would you ever kiss me?
I'm not even half as pretty
You gave her your sweater, it's just polyester
But you like her better
(Wish I were Heather)

Watch as she stands with her holding your hand
Put your arm 'round her shoulder, now I'm getting colder
But how could I hate her? She's such an angel
But then again, kinda wish she were dead as she

Walks by
What a sight for sore eyes, brighter than a blue sky
She's got you mesmerized while I die

Why would you ever kiss me?
I'm not even half as pretty
You gave her your sweater, it's just polyester
But you like her better
I wish I were Heather

(Oh) wish I were Heather
(Oh, oh) wish I were Heather

Why would you ever kiss me?
I'm not even half as pretty
You gave her your sweater, it's just polyester
But you like her better
Wish I were`;


// ===================================================
//  PRELOAD
//  Carga el audio antes de entrar al juego.
//  OJO: como nivel3.html está en /template,
//  la ruta correcta es ../assets/audio/...
// ===================================================
class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        // Canción subnivel 10
        this.load.audio('n3_song1', '../assets/audio/cancion5.mp3');

        // Canción subnivel 20
        this.load.audio('n3_song2', '../assets/audio/cancion6.mp3');
    }

    create() {
        this.scene.start('LevelSelect');
    }
}


// ===================================================
//  LISTA DE FRASES DEL NIVEL 3
//  Sub 10 y 20 son canciones
// ===================================================
    const words20_n3 = [
    "El individuo inicia un desplazamiento extraatmosférico bajo condiciones de microgravedad controlada.",
    "La ausencia de resistencia aerodinámica modifica significativamente la dinámica corporal y direccional.",
    "La orientación espacial depende de referencias limitadas y de una percepción interna altamente precisa.",
    "El movimiento se ejecuta mediante impulsos calculados, minimizando desviaciones y errores acumulativos.",
    "La exposición prolongada al vacío exige adaptación fisiológica, control cognitivo y concentración sostenida.",
    "La estabilidad general depende de la correcta distribución de fuerzas en cada acción realizada.",
    "La percepción del tiempo y del espacio presenta alteraciones progresivas por falta de referencias convencionales.",
    "El individuo se aproxima a una región de transición donde cambia su comprensión del entorno inmediato.",
    "La fase previa al arribo requiere precisión absoluta en la trayectoria y anticipación constante del movimiento.",
    song_n3_10,

    "El aterrizaje sobre la superficie lunar implica adaptación inmediata a un entorno extremo y silencioso.",
    "La gravedad reducida modifica de forma sustancial la biomecánica del movimiento corporal.",
    "La interacción con el suelo depende de la composición del terreno y de la fuerza aplicada en cada impulso.",
    "La ausencia de atmósfera funcional transforma la experiencia sensorial y limita la transmisión de estímulos auditivos.",
    "El análisis del entorno lunar permite optimizar la orientación, la movilidad y la planificación del avance.",
    "Cada movimiento requiere precisión técnica, control postural y anticipación continua de sus consecuencias.",
    "La exploración se convierte en un proceso sistemático de observación, evaluación y ajuste permanente.",
    "La percepción del espacio profundo redefine la interpretación del entorno próximo y del objetivo alcanzado.",
    "Finalmente, el individuo comprende que el trayecto completo produjo una transformación física, cognitiva y simbólica.",
    song_n3_20
    ];

// ===================================================
//  FUNCIONES DE DESBLOQUEO
// ===================================================
function getUnlockedLevel_n3() {
    let unlocked = localStorage.getItem('n3_max');

    if (!unlocked) {
        unlocked = 1;
        localStorage.setItem('n3_max', unlocked);
    } else {
        unlocked = parseInt(unlocked, 10);
    }

    return unlocked;
}

function setUnlockedLevel_n3(level) {
    const current = getUnlockedLevel_n3();
    if (level > current) {
        localStorage.setItem('n3_max', level);
    }
}


// ===================================================
//  ESCENA: SELECTOR DE SUBNIVELES
// ===================================================
class LevelSelect extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelect' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const unlocked = getUnlockedLevel_n3();

        // Limpia overlays viejos si quedaron abiertos
        document.querySelectorAll('.typing-overlay').forEach(el => el.remove());

        this.add.rectangle(W / 2, H / 2, W, H, 0x00001a);

        // Estrellas decorativas
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.5);
        for (let i = 0; i < 60; i++) {
            g.fillCircle(Math.random() * 800, Math.random() * 600, Math.random() < 0.7 ? 1 : 1.5);
        }

        this.add.text(W / 2, 38, 'NIVEL 3 — LUNA', {
            fontSize: '26px',
            fill: '#a0a8ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, 68, 'Objetivo: 70 palabras por minuto', {
            fontSize: '13px',
            fill: '#4a4a8a',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(W / 2, 88, 'Selecciona un subnivel', {
            fontSize: '13px',
            fill: '#444',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(20, 12, '← Menú', {
            fontSize: '15px',
            fill: '#aaa',
            fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#fff' }));
        menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#aaa' }));
        menuBtn.on('pointerdown', () => {
            window.location.href = 'index1.html';
        });

        for (let i = 0; i < 20; i++) {
            const sublevel = i + 1;
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 130 + col * 135;
            const y = 155 + row * 100;

            const isActive = sublevel <= unlocked;
            const isSong = sublevel === 10 || sublevel === 20;
            const bgColor = isActive ? (isSong ? 0x1a1a6e : 0x1a1a5e) : 0x1a1a1a;
            const txtColor = isActive ? '#a0a8ff' : '#444444';

            const btn = this.add.rectangle(x, y, 110, 60, bgColor)
                .setStrokeStyle(2, isActive ? (isSong ? 0xccccff : 0x6666ff) : 0x333333);

            if (isActive) {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerover', () => btn.setFillStyle(isSong ? 0x3a3a9e : 0x2a2a8e));
                btn.on('pointerout', () => btn.setFillStyle(bgColor));

                btn.on('pointerdown', () => {
                    const timeLimit = isSong ? 240 : 60;

                    this.scene.start('PlayGame', {
                        sublevel,
                        word: words20_n3[i],
                        timeLimit
                    });
                });
            }

            this.add.text(x, y - 9, `Subnivel ${sublevel}`, {
                fontSize: '13px',
                fill: txtColor,
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(x, y + 12, isActive ? (isSong ? '🎵 JUGAR' : '▶ JUGAR') : '🔒', {
                fontSize: '11px',
                fill: isActive ? '#a0a8ff' : '#333',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
    }
}


// ===================================================
//  ESCENA: JUEGO
// ===================================================
class PlayGame extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayGame' });
    }

    init(data) {
        this.sublevel = data.sublevel || 1;
        this.targetText = data.word || '';
        this.typed = '';

        this.timeLeft = data.timeLimit || 60;
        this.initialTime = this.timeLeft;

        this.finished = false;
        this.startTime = null;
        this.timerStarted = false;
        this.timerEvent = null;

        this.overlay = null;
        this.inputEl = null;
        this.phraseEl = null;
        this.scrollBox = null;

        this.isSongLevel = this.sublevel === 10 || this.sublevel === 20;

        this.music = null;
        this.musicEnabled = true;
        this.soundBtn = null;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.rectangle(W / 2, H / 2, W, H, 0x00001a);

        // Estrellas decorativas
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.4);
        for (let i = 0; i < 80; i++) {
            g.fillCircle(Math.random() * 800, Math.random() * 600, Math.random() < 0.7 ? 1 : 1.5);
        }

        this.add.text(W / 2, 28, `SUBNIVEL ${this.sublevel} — Luna | Meta: 70 WPM`, {
            fontSize: '16px',
            fill: '#a0a8ff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const back = this.add.text(16, 12, '← Volver', {
            fontSize: '14px',
            fill: '#aaa',
            fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });

        back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
        back.on('pointerout', () => back.setStyle({ fill: '#aaa' }));
        back.on('pointerdown', () => {
            this.stopMusic();
            this.cleanup();
            this.scene.start('LevelSelect');
        });

        this.timerPhaserText = this.add.text(W - 16, 12, '⏱ Escribe para iniciar', {
            fontSize: '14px',
            fill: '#555',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(1, 0);

        // Botón de sonido
        if (this.isSongLevel) {
            this.soundBtn = this.add.text(W - 110, 12, '🔊', {
                fontSize: '20px',
                fill: '#ffdd55',
                fontFamily: 'Courier New'
            }).setInteractive({ useHandCursor: true });

            this.soundBtn.on('pointerdown', () => {
                this.musicEnabled = !this.musicEnabled;

                if (this.musicEnabled) {
                    this.soundBtn.setText('🔊');

                    if (this.music && this.timerStarted && !this.music.isPlaying) {
                        this.music.resume ? this.music.resume() : this.music.play();
                    }
                } else {
                    this.soundBtn.setText('🔇');

                    if (this.music && this.music.isPlaying) {
                        this.music.pause();
                    }
                }
            });
        }

        this.wpmPhaserText = this.add.text(16, 38, 'WPM: 0', {
            fontSize: '14px',
            fill: '#66ccff',
            fontFamily: 'Courier New'
        });

        this.accPhaserText = this.add.text(16, 58, 'Precisión: 100%', {
            fontSize: '14px',
            fill: '#aaaaff',
            fontFamily: 'Courier New'
        });

        this.add.text(W - 16, 38, '🎯 Meta: 70 WPM', {
            fontSize: '13px',
            fill: '#4a4a8a',
            fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        this.add.text(W / 2, 82, 'Escribe la frase exactamente como aparece:', {
            fontSize: '12px',
            fill: '#444',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Barra de progreso
        this.add.rectangle(W / 2, H - 28, W - 60, 14, 0x0a0a2a).setOrigin(0.5);
        this.progressBar = this.add.rectangle(30, H - 28, 2, 10, 0x4444cc).setOrigin(0, 0.5);
        this.progressMaxW = W - 60;

        this.progressPct = this.add.text(W / 2, H - 28, '0%', {
            fontSize: '10px',
            fill: '#555',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.hintText = this.add.text(W / 2, H - 60, '🖱 Haz clic en la pantalla para escribir', {
            fontSize: '12px',
            fill: '#333',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.buildHTMLOverlay(W, H);

        // Cargar música según subnivel
        if (this.isSongLevel) {
            const audioKey = this.sublevel === 10 ? 'n3_song1' : 'n3_song2';

            if (this.cache.audio.exists(audioKey)) {
                this.music = this.sound.add(audioKey, {
                    loop: false,
                    volume: 0.5
                });
            }
        }
    }

    buildHTMLOverlay(W, H) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / W;

        this.overlay = document.createElement('div');
        this.overlay.className = 'typing-overlay';

        Object.assign(this.overlay.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            pointerEvents: 'none',
            zIndex: '10',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        });

        this.scrollBox = document.createElement('div');
        Object.assign(this.scrollBox.style, {
            background: 'rgba(0,0,10,0.75)',
            border: '1px solid #1a1a4e',
            borderRadius: '8px',
            padding: '22px 28px',
            maxWidth: `${Math.round(720 * scaleX)}px`,
            width: '90%',
            height: this.isSongLevel ? `${Math.round(320 * scaleX)}px` : 'auto',
            maxHeight: this.isSongLevel ? `${Math.round(320 * scaleX)}px` : 'none',
            overflowY: 'hidden',
            overflowX: 'hidden',
            boxShadow: 'inset 0 0 24px rgba(0,0,30,0.6)'
        });

        this.phraseEl = document.createElement('div');
        Object.assign(this.phraseEl.style, {
            fontFamily: '"Courier New", monospace',
            fontSize: `${Math.round(18 * scaleX)}px`,
            lineHeight: this.isSongLevel ? '1.95' : '1.9',
            textAlign: 'left',
            letterSpacing: '1px',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            userSelect: 'none',
            transform: 'translateY(0px)',
            transition: 'transform 0.08s linear'
        });

        this.renderPhrase();
        this.scrollBox.appendChild(this.phraseEl);
        this.overlay.appendChild(this.scrollBox);

        // Input invisible
        this.inputEl = document.createElement('input');
        Object.assign(this.inputEl.style, {
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            opacity: '0',
            width: '1px',
            height: '1px',
            border: 'none',
            outline: 'none',
            pointerEvents: 'all'
        });

        this.inputEl.setAttribute('autocomplete', 'off');
        this.inputEl.setAttribute('autocorrect', 'off');
        this.inputEl.setAttribute('autocapitalize', 'none');
        this.inputEl.setAttribute('spellcheck', 'false');

        this.inputEl.addEventListener('input', () => this.onInput());
        this.inputEl.addEventListener('paste', e => e.preventDefault());
        this.inputEl.addEventListener('keydown', e => {
            if (this.finished) e.preventDefault();
        });

        this.overlay.appendChild(this.inputEl);
        document.body.appendChild(this.overlay);

        setTimeout(() => this.inputEl.focus(), 150);
        this.game.canvas.addEventListener('click', () => this.inputEl.focus());
    }

    renderPhrase() {
        const target = this.targetText;
        const typed = this.typed;
        let html = '';

        for (let i = 0; i < target.length; i++) {
            const ch = target[i];
            const display = ch === ' ' ? '&nbsp;' : ch;

            if (i < typed.length) {
                html += typed[i] === target[i]
                    ? `<span style="color:#8888ff">${display}</span>`
                    : ch === ' '
                        ? `<span style="color:#ff4444;text-decoration:underline">&nbsp;</span>`
                        : `<span style="color:#ff4444;background:rgba(255,0,0,0.12)">${display}</span>`;
            } else if (i === typed.length) {
                html += `<span style="color:#fff;border-bottom:2px solid #a0a8ff;padding-bottom:1px">${display}</span>`;
            } else {
                html += `<span style="color:#2a2a4a">${display}</span>`;
            }
        }

        this.phraseEl.innerHTML = html;

        // Scroll automático más suave
        if (this.isSongLevel && this.scrollBox && this.phraseEl) {
            const visibleHeight = this.scrollBox.clientHeight;
            const fullHeight = this.phraseEl.scrollHeight;
            const maxMove = Math.max(0, fullHeight - visibleHeight);

            let progress = 0;

            if (this.music && this.music.isPlaying && this.music.duration > 0) {
                // Espera antes de empezar a subir
                const delay = 10;
                const adjustedTime = Math.max(0, this.music.seek - delay);
                const adjustedDuration = Math.max(1, this.music.duration - delay);

                progress = adjustedTime / adjustedDuration;
            } else {
                progress = target.length > 0 ? typed.length / target.length : 0;
            }

            progress = Phaser.Math.Clamp(progress, 0, 1);

            if (progress < 0.05) {
                progress = 0;
            }

            const slowFactor = 0.65;
            const moveY = maxMove * progress * slowFactor;

            this.phraseEl.style.transform = `translateY(-${moveY}px)`;
        }
    }

    onInput() {
        if (this.finished) return;

        let raw = this.inputEl.value;

        if (raw.length > this.targetText.length) {
            raw = raw.slice(0, this.targetText.length);
            this.inputEl.value = raw;
        }

        if (!this.timerStarted && raw.length > 0) {
            this.timerStarted = true;
            this.startTime = Date.now();

            this.timerPhaserText.setText(`⏱ ${this.initialTime}s`);
            this.timerPhaserText.setStyle({ fill: '#ffdd55', fontSize: '18px' });
            this.hintText.setVisible(false);

            this.timerEvent = this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: this.tickTimer,
                callbackScope: this
            });

            if (this.isSongLevel && this.music && this.musicEnabled && !this.music.isPlaying) {
                this.music.play();
            }
        }

        this.typed = raw;
        this.renderPhrase();
        this.updateStats();

        if (this.typed.length === this.targetText.length) {
            this.endGame(this.typed === this.targetText);
        }
    }

    updateStats() {
        const typed = this.typed;
        const target = this.targetText;

        const pct = typed.length / target.length;
        this.progressBar.width = Math.max(2, this.progressMaxW * pct);
        this.progressPct.setText(Math.round(pct * 100) + '%');

        if (this.startTime) {
            const mins = (Date.now() - this.startTime) / 60000;
            const words = typed.trim().split(/\s+/).filter(Boolean).length;
            const wpm = mins > 0 ? Math.round(words / mins) : 0;

            this.wpmPhaserText.setText(`WPM: ${wpm}`);
            this.wpmPhaserText.setStyle({
                fill: wpm >= 70 ? '#8888ff' : wpm >= 50 ? '#ffdd55' : '#66ccff'
            });
        }

        let correct = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++;
        }

        const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        this.accPhaserText.setText(`Precisión: ${acc}%`);
    }

    tickTimer() {
        if (this.finished) return;

        this.timeLeft--;
        this.timerPhaserText.setText(`⏱ ${this.timeLeft}s`);

        if (this.timeLeft <= 10) {
            this.timerPhaserText.setStyle({ fill: '#ff4444' });
        } else if (this.timeLeft <= 20) {
            this.timerPhaserText.setStyle({ fill: '#ffaa00' });
        }

        if (this.isSongLevel) {
            this.renderPhrase();
        }

        if (this.timeLeft <= 0) {
            this.endGame(false);
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
            this.music.destroy();
            this.music = null;
        }
    }

    endGame(won) {
        if (this.finished) return;
        this.finished = true;

        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        this.stopMusic();

        if (won && this.sublevel < 20) {
            setUnlockedLevel_n3(this.sublevel + 1);
        }

        const typed = this.typed;
        const target = this.targetText;
        let correct = 0;

        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++;
        }

        const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
        const elapsed = this.startTime ? (Date.now() - this.startTime) / 60000 : 1 / 60;
        const words = typed.trim().split(/\s+/).filter(Boolean).length;
        const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
        const timeUsed = this.initialTime - this.timeLeft;

        this.cleanup();

        this.scene.start('ResultScreen', {
            won,
            acc,
            wpm,
            typed,
            target,
            sublevel: this.sublevel,
            timeUsed,
            correct,
            total: target.length,
            initialTime: this.initialTime
        });
    }

    cleanup() {
        this.stopMusic();

        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }

    shutdown() {
        this.cleanup();
    }

    destroy() {
        this.cleanup();
    }
}


// ===================================================
//  ESCENA: RESULTADOS
// ===================================================
class ResultScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScreen' });
    }

    init(data) {
        this.won = data.won;
        this.acc = data.acc;
        this.wpm = data.wpm;
        this.sublevel = data.sublevel;
        this.timeUsed = data.timeUsed;
        this.typed = data.typed;
        this.target = data.target;
        this.correct = data.correct;
        this.total = data.total;
        this.initialTime = data.initialTime || 60;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.rectangle(W / 2, H / 2, W, H, 0x00000f);

        // Estrellas decorativas
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.3);
        for (let i = 0; i < 60; i++) {
            g.fillCircle(Math.random() * 800, Math.random() * 600, 1);
        }

        const pW = 520;
        const pH = 400;

        this.add.rectangle(W / 2, H / 2, pW, pH, 0x05051a)
            .setStrokeStyle(2, this.won ? 0xa0a8ff : 0xff4444);

        const metaOk = this.wpm >= 70;
        const icon = this.won ? (metaOk ? '🌙' : '✅') : '⏰';
        const title = this.won ? (metaOk ? '¡LLEGASTE A LA LUNA!' : '¡FRASE COMPLETA!') : 'TIEMPO AGOTADO';
        const color = this.won ? (metaOk ? '#a0a8ff' : '#ffdd55') : '#ff4444';

        this.add.text(W / 2, H / 2 - 165, icon, {
            fontSize: '36px'
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 125, title, {
            fontSize: '26px',
            fill: color,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 92, `Subnivel ${this.sublevel} — Luna`, {
            fontSize: '14px',
            fill: '#a0a8ff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 72,
            `${this.wpm} WPM ${metaOk ? '✓ Meta alcanzada' : '✗ Meta: 70 WPM'}`, {
                fontSize: '14px',
                fill: metaOk ? '#a0a8ff' : '#ff8844',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.add.rectangle(W / 2, H / 2 - 55, pW - 60, 1, 0x1a1a4e);

        [
            ['⌛ Tiempo', `${this.timeUsed}s de ${this.initialTime}s`],
            ['⚡ Velocidad', `${this.wpm} WPM`],
            ['🎯 Precisión', `${this.acc}%`],
            ['✅ Correctas', `${this.correct} / ${this.total} letras`]
        ].forEach(([lbl, val], i) => {
            const y = H / 2 - 32 + i * 42;

            if (i % 2 === 0) {
                this.add.rectangle(W / 2, y + 8, pW - 60, 32, 0x0a0a28).setOrigin(0.5);
            }

            this.add.text(W / 2 - 190, y, lbl, {
                fontSize: '14px',
                fill: '#888',
                fontFamily: 'Courier New'
            });

            this.add.text(W / 2 + 185, y, val, {
                fontSize: '14px',
                fill: '#fff',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }).setOrigin(1, 0);
        });

        this.add.rectangle(W / 2, H / 2 + 108, pW - 60, 1, 0x1a1a4e);

        this.add.text(
            W / 2,
            H / 2 + 126,
            this.won
                ? (metaOk ? '¡Excelente! Siguiente subnivel desbloqueado.' : 'Completo, pero mejora la velocidad.')
                : '¡Sigue practicando, llegarás a la luna!',
            {
                fontSize: '12px',
                fill: '#555',
                fontFamily: 'Courier New'
            }
        ).setOrigin(0.5);

        const hasNext = this.won && this.sublevel < 20;
        const btnY = H / 2 + 162;

        if (hasNext) {
            this.makeBtn(W / 2 - 240, btnY, '↺ Reintentar', 0x1a1a5e, () => {
                const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
                this.scene.start('PlayGame', {
                    sublevel: this.sublevel,
                    word: words20_n3[this.sublevel - 1],
                    timeLimit: tl
                });
            });

            this.makeBtn(W / 2 - 80, btnY, '☰ Subniveles', 0x0d0d3a, () => {
                this.scene.start('LevelSelect');
            });

            this.makeBtn(W / 2 + 80, btnY, `▶ Sub ${this.sublevel + 1}`, 0x1a2a6e, () => {
                const next = this.sublevel + 1;
                const tl = (next === 10 || next === 20) ? 240 : 60;

                this.scene.start('PlayGame', {
                    sublevel: next,
                    word: words20_n3[next - 1],
                    timeLimit: tl
                });
            });

            this.makeBtn(W / 2 + 240, btnY, '🏠 Menú', 0x1a1a1a, () => {
                window.location.href = 'index1.html';
            });
        } else {
            this.makeBtn(W / 2 - 190, btnY, '↺ Reintentar', 0x1a1a5e, () => {
                const tl = (this.sublevel === 10 || this.sublevel === 20) ? 240 : 60;
                this.scene.start('PlayGame', {
                    sublevel: this.sublevel,
                    word: words20_n3[this.sublevel - 1],
                    timeLimit: tl
                });
            });

            this.makeBtn(W / 2, btnY, '☰ Subniveles', 0x0d0d3a, () => {
                this.scene.start('LevelSelect');
            });

            this.makeBtn(W / 2 + 190, btnY, '🏠 Menú', 0x1a1a1a, () => {
                window.location.href = 'index1.html';
            });
        }
    }

    makeBtn(x, y, label, bg, cb, w = 140) {
        const btn = this.add.rectangle(x, y, w, 44, bg)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(1, 0xffffff33);

        this.add.text(x, y, label, {
            fontSize: '13px',
            fill: '#fff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setAlpha(0.75));
        btn.on('pointerout', () => btn.setAlpha(1));
        btn.on('pointerdown', cb);
    }
}


// ===================================================
//  INICIAR PHASER
// ===================================================
window.onload = function () {
    new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        backgroundColor: '#00000f',
        scene: [Preload, LevelSelect, PlayGame, ResultScreen]
    });
};