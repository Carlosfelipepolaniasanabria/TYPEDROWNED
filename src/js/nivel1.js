// ===================================================
//  nivel1.js — CON DESBLOQUEO DE SUBNIVELES
//  Usa las frases progresivas del usuario
//  ✅ PROGRESO REINICIABLE AL CERRAR LA PESTAÑA (sessionStorage)
// ===================================================

// ===================================================
//  LISTA DE FRASES (20 subniveles, dificultad progresiva)
// ===================================================
const words20 = [
    // Subnivel 1 — muy fácil, palabras cortas
    "El sol da luz y paz al mar sin mal ni voz",
    // Subnivel 2
    "La luna y el mar dan paz y luz a todo ser",
    // Subnivel 3
    "El viento mueve el agua fría del río con calma",
    // Subnivel 4
    "Una mano amiga vale más que mil palabras vacías",
    // Subnivel 5
    "La vida es bella cuando sabes ver lo que tienes",
    // Subnivel 6 — dificultad media
    "Cada día trae nuevas oportunidades para crecer y aprender algo valioso",
    // Subnivel 7
    "El trabajo constante y la dedicación abren puertas que parecían cerradas",
    // Subnivel 8
    "Quien domina las palabras puede expresar con claridad todo lo que piensa",
    // Subnivel 9
    "La práctica diaria de la escritura mejora la velocidad y la precisión",
    // Subnivel 10
    "El conocimiento se construye poco a poco con esfuerzo y mucha paciencia",
    // Subnivel 11 — dificultad alta
    "La mecanografía es una habilidad valiosa que todo profesional debe dominar con dedicación",
    // Subnivel 12
    "Escribir rápido y con precisión requiere concentración total y práctica constante cada día",
    // Subnivel 13
    "El cerebro humano es capaz de aprender cualquier habilidad si se entrena correctamente",
    // Subnivel 14
    "La tecnología avanza rápidamente y quienes escriben bien tienen ventaja en el mundo digital",
    // Subnivel 15
    "Dominar el teclado es tan importante hoy como lo fue aprender a escribir a mano antes",
    // Subnivel 16 — muy difícil
    "La perseverancia y la disciplina son las dos cualidades que separan al experto del principiante",
    // Subnivel 17
    "Cada error que cometes al escribir es una oportunidad de aprender y mejorar tu técnica",
    // Subnivel 18
    "La velocidad en la escritura se logra cuando los dedos memorizan la posición exacta de cada tecla",
    // Subnivel 19
    "El programador, el escritor y el profesional moderno comparten una herramienta clave: el teclado eficiente",
    // Subnivel 20 — nivel máximo
    "Felicitaciones, has llegado al nivel más difícil del subsuelo, tu dedicación y esfuerzo te han traído hasta aquí"
];

// ===================================================
//  FUNCIONES DE DESBLOQUEO (sessionStorage → se reinicia al cerrar pestaña)
// ===================================================
function getUnlockedLevel() {
    let unlocked = sessionStorage.getItem('subsuelo_unlocked');
    if (!unlocked) {
        unlocked = 1;
        sessionStorage.setItem('subsuelo_unlocked', unlocked);
    } else {
        unlocked = parseInt(unlocked, 10);
    }
    return unlocked;
}

function setUnlockedLevel(level) {
    let current = getUnlockedLevel();
    if (level > current) {
        sessionStorage.setItem('subsuelo_unlocked', level);
    }
}

// ===================================================
//  ESCENA: LevelSelect
// ===================================================
class LevelSelect extends Phaser.Scene {
    constructor() { super({ key: 'LevelSelect' }); }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const unlocked = getUnlockedLevel();

        this.add.rectangle(W / 2, H / 2, W, H, 0x1a0a00);

        this.add.text(W / 2, 38, 'NIVEL 1 — SUBSUELO', {
            fontSize: '26px', fill: '#e8a060',
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, 72, 'Selecciona un subnivel', {
            fontSize: '13px', fill: '#666', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(20, 12, '← Menú', {
            fontSize: '15px', fill: '#aaa', fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });
        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#fff' }));
        menuBtn.on('pointerout',  () => menuBtn.setStyle({ fill: '#aaa' }));
        menuBtn.on('pointerdown', () => window.location.href = 'index1.html');

        for (let i = 0; i < 20; i++) {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x   = 130 + col * 135;
            const y   = 155 + row * 100;

            const isActive = (i + 1) <= unlocked;
            const bgColor  = isActive ? 0x2d6e1a : 0x2a2a2a;
            const txtColor = isActive ? '#ffffff' : '#555555';

            const btn = this.add.rectangle(x, y, 110, 60, bgColor)
                .setStrokeStyle(2, isActive ? 0x55cc33 : 0x444444);

            if (isActive) {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerover', () => btn.setFillStyle(0x3d9e25));
                btn.on('pointerout',  () => btn.setFillStyle(bgColor));
                btn.on('pointerdown', () => {
                    this.scene.start('PlayGame', { sublevel: i + 1, word: words20[i] });
                });
            } else {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerover', () => btn.setFillStyle(0x3a3a3a));
                btn.on('pointerout',  () => btn.setFillStyle(bgColor));
                btn.on('pointerdown', () => this.showLockedMessage(i + 1));
            }

            this.add.text(x, y - 9, `Subnivel ${i + 1}`, {
                fontSize: '13px', fill: txtColor,
                fontFamily: 'Courier New', fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(x, y + 12, isActive ? '▶ JUGAR' : '🔒', {
                fontSize: '11px', fill: isActive ? '#88ff66' : '#444',
                fontFamily: 'Courier New'
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
//  ESCENA: PlayGame
// ===================================================
class PlayGame extends Phaser.Scene {
    constructor() { super({ key: 'PlayGame' }); }

    init(data) {
        this.sublevel     = data.sublevel || 1;
        this.targetText   = data.word || '';
        this.typed        = '';
        this.timeLeft     = 60;
        this.finished     = false;
        this.startTime    = null;
        this.timerStarted = false;
        this.timerEvent   = null;
        this.overlay      = null;
        this.inputEl      = null;
        this.phraseEl     = null;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.rectangle(W / 2, H / 2, W, H, 0x1a0a00);

        this.add.text(W / 2, 28, `SUBNIVEL ${this.sublevel} — Subsuelo`, {
            fontSize: '18px', fill: '#e8a060',
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        const back = this.add.text(16, 12, '← Volver', {
            fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });
        back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
        back.on('pointerout',  () => back.setStyle({ fill: '#aaa' }));
        back.on('pointerdown', () => { this.cleanup(); this.scene.start('LevelSelect'); });

        this.timerPhaserText = this.add.text(W - 16, 12, '⏱ Escribe para iniciar', {
            fontSize: '15px', fill: '#888',
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(1, 0);

        this.wpmPhaserText = this.add.text(16, 38, 'WPM: 0', {
            fontSize: '14px', fill: '#66ccff', fontFamily: 'Courier New'
        });
        this.accPhaserText = this.add.text(16, 58, 'Precisión: 100%', {
            fontSize: '14px', fill: '#aaffaa', fontFamily: 'Courier New'
        });

        this.add.text(W / 2, 85, 'Escribe la frase exactamente como aparece:', {
            fontSize: '12px', fill: '#666', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Barra de progreso
        this.add.rectangle(W / 2, H - 28, W - 60, 14, 0x2a2a2a).setOrigin(0.5);
        this.progressBar  = this.add.rectangle(30, H - 28, 2, 10, 0x2d6e1a).setOrigin(0, 0.5);
        this.progressMaxW = W - 60;
        this.progressPct  = this.add.text(W / 2, H - 28, '0%', {
            fontSize: '10px', fill: '#888', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Hint de cursor centrado en pantalla
        this.hintText = this.add.text(W / 2, H - 60, '🖱 Haz clic en la pantalla para escribir', {
            fontSize: '12px', fill: '#444', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.buildHTMLOverlay(W, H);
    }

    buildHTMLOverlay(W, H) {
        const canvas = this.game.canvas;
        const rect   = canvas.getBoundingClientRect();
        const scaleX = rect.width / W;

        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position:       'fixed',
            top:            rect.top  + 'px',
            left:           rect.left + 'px',
            width:          rect.width  + 'px',
            height:         rect.height + 'px',
            pointerEvents:  'none',
            zIndex:         '10',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
        });

        // ── Caja de frase (visible, centrada) ──
        this.phraseEl = document.createElement('div');
        Object.assign(this.phraseEl.style, {
            fontFamily:    '"Courier New", monospace',
            fontSize:      `${Math.round(22 * scaleX)}px`,
            lineHeight:    '1.75',
            background:    'rgba(0,0,0,0.6)',
            border:        '1px solid #3a2000',
            borderRadius:  '8px',
            padding:       '20px 26px',
            maxWidth:      `${Math.round(680 * scaleX)}px`,
            width:         '85%',
            textAlign:     'left',
            letterSpacing: '1.5px',
            wordBreak:     'break-word',
            userSelect:    'none',
            boxShadow:     'inset 0 0 20px rgba(0,0,0,0.4)',
        });
        this.renderPhrase();
        this.overlay.appendChild(this.phraseEl);

        // ── Input COMPLETAMENTE INVISIBLE — solo captura el teclado ──
        this.inputEl = document.createElement('input');
        Object.assign(this.inputEl.style, {
            position:   'fixed',
            top:        '-9999px',
            left:       '-9999px',
            opacity:    '0',
            width:      '1px',
            height:     '1px',
            border:     'none',
            outline:    'none',
            pointerEvents: 'all',
        });
        this.inputEl.setAttribute('autocomplete',   'off');
        this.inputEl.setAttribute('autocorrect',    'off');
        this.inputEl.setAttribute('autocapitalize', 'none');
        this.inputEl.setAttribute('spellcheck',     'false');

        this.inputEl.addEventListener('input',   () => this.onInput());
        this.inputEl.addEventListener('paste',   e  => e.preventDefault());
        this.inputEl.addEventListener('keydown', e  => {
            if (this.finished) { e.preventDefault(); return; }
        });

        this.overlay.appendChild(this.inputEl);
        document.body.appendChild(this.overlay);

        setTimeout(() => this.inputEl.focus(), 150);
        this.game.canvas.addEventListener('click', () => this.inputEl.focus());
    }

    renderPhrase() {
        const target = this.targetText;
        const typed  = this.typed;
        let   html   = '';

        for (let i = 0; i < target.length; i++) {
            const ch      = target[i];
            const display = ch === ' ' ? '&nbsp;' : ch;

            if (i < typed.length) {
                if (typed[i] === target[i]) {
                    html += `<span style="color:#44ff66">${display}</span>`;
                } else {
                    html += ch === ' '
                        ? `<span style="color:#ff4444;text-decoration:underline">&nbsp;</span>`
                        : `<span style="color:#ff4444;background:rgba(255,0,0,0.12)">${ch}</span>`;
                }
            } else if (i === typed.length) {
                html += `<span style="color:#ffffff;border-bottom:2px solid #ffdd55;padding-bottom:1px">${display}</span>`;
            } else {
                html += `<span style="color:#4a4a4a">${display}</span>`;
            }
        }

        this.phraseEl.innerHTML = html;
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
            this.startTime    = Date.now();
            this.timerPhaserText.setText('⏱ 60s');
            this.timerPhaserText.setStyle({ fill: '#ffdd55', fontSize: '18px' });
            this.hintText.setVisible(false);

            this.timerEvent = this.time.addEvent({
                delay: 1000, loop: true,
                callback: this.tickTimer, callbackScope: this
            });
        }

        this.typed = raw;
        this.renderPhrase();
        this.updateStats();

        if (this.typed.length === this.targetText.length) {
            const won = this.typed === this.targetText;
            this.endGame(won);
        }
    }

    updateStats() {
        const typed  = this.typed;
        const target = this.targetText;

        const pct = typed.length / target.length;
        this.progressBar.width = Math.max(2, this.progressMaxW * pct);
        this.progressPct.setText(Math.round(pct * 100) + '%');

        if (this.startTime) {
            const mins  = (Date.now() - this.startTime) / 60000;
            const words = typed.trim().split(/\s+/).filter(Boolean).length;
            const wpm   = mins > 0 ? Math.round(words / mins) : 0;
            this.wpmPhaserText.setText(`WPM: ${wpm}`);
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

        if      (this.timeLeft <= 10) this.timerPhaserText.setStyle({ fill: '#ff4444' });
        else if (this.timeLeft <= 20) this.timerPhaserText.setStyle({ fill: '#ffaa00' });

        if (this.timeLeft <= 0) this.endGame(false);
    }

    endGame(won) {
        if (this.finished) return;
        this.finished = true;

        if (this.timerEvent) this.timerEvent.remove();

        // DESBLOQUEAR SIGUIENTE SUBNIVEL SI SE GANÓ
        if (won) {
            const nextLevel = this.sublevel + 1;
            if (nextLevel <= 20) {
                setUnlockedLevel(nextLevel);
            }
        }

        const typed   = this.typed;
        const target  = this.targetText;
        let   correct = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++;
        }
        const acc      = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
        const elapsed  = this.startTime ? (Date.now() - this.startTime) / 60000 : 1 / 60;
        const words    = typed.trim().split(/\s+/).filter(Boolean).length;
        const wpm      = elapsed > 0 ? Math.round(words / elapsed) : 0;
        const timeUsed = 60 - this.timeLeft;

        this.cleanup();

        this.scene.start('ResultScreen', {
            won, acc, wpm, typed, target,
            sublevel: this.sublevel,
            timeUsed, correct,
            total: target.length
        });
    }

    cleanup() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }

    shutdown() { this.cleanup(); }
    destroy()  { this.cleanup(); }
}

// ===================================================
//  ESCENA: ResultScreen
// ===================================================
class ResultScreen extends Phaser.Scene {
    constructor() { super({ key: 'ResultScreen' }); }

    init(data) {
        this.won      = data.won;
        this.acc      = data.acc;
        this.wpm      = data.wpm;
        this.sublevel = data.sublevel;
        this.timeUsed = data.timeUsed;
        this.typed    = data.typed;
        this.target   = data.target;
        this.correct  = data.correct;
        this.total    = data.total;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.add.rectangle(W / 2, H / 2, W, H, 0x0a0300);

        const pW = 500, pH = 370;
        const panel = this.add.rectangle(W / 2, H / 2, pW, pH, 0x160800);
        panel.setStrokeStyle(2, this.won ? 0x44ff66 : 0xff4444);

        const icon  = this.won ? '🏆' : '⏰';
        const title = this.won ? '¡COMPLETADO!' : 'TIEMPO AGOTADO';
        const color = this.won ? '#44ff66'       : '#ff4444';

        this.add.text(W / 2, H / 2 - 155, icon,  { fontSize: '36px' }).setOrigin(0.5);
        this.add.text(W / 2, H / 2 - 115, title, {
            fontSize: '30px', fill: color,
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 82, `Subnivel ${this.sublevel} — Subsuelo`, {
            fontSize: '14px', fill: '#e8a060', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.rectangle(W / 2, H / 2 - 62, pW - 60, 1, 0x3a1500);

        const rows = [
            ['⌛ Tiempo',    `${this.timeUsed}s de 60s`],
            ['⚡ Velocidad', `${this.wpm} WPM`],
            ['🎯 Precisión', `${this.acc}%`],
            ['✅ Correctas', `${this.correct} / ${this.total} letras`],
        ];

        rows.forEach(([lbl, val], i) => {
            const y = H / 2 - 38 + i * 44;
            if (i % 2 === 0) {
                this.add.rectangle(W / 2, y + 8, pW - 60, 34, 0x1e0c00).setOrigin(0.5);
            }
            this.add.text(W / 2 - 180, y, lbl, {
                fontSize: '15px', fill: '#aaa', fontFamily: 'Courier New'
            });
            this.add.text(W / 2 + 175, y, val, {
                fontSize: '15px', fill: '#fff',
                fontFamily: 'Courier New', fontStyle: 'bold'
            }).setOrigin(1, 0);
        });

        this.add.rectangle(W / 2, H / 2 + 110, pW - 60, 1, 0x3a1500);

        const msg = this.won
            ? (this.acc >= 95 ? '¡Excelente precisión!' : '¡Buen trabajo! Mejora la precisión.')
            : (this.typed.length > this.total * 0.7
                ? '¡Casi! Intenta escribir más rápido.'
                : 'Sigue practicando, ¡tú puedes!');

        this.add.text(W / 2, H / 2 + 128, msg, {
            fontSize: '12px', fill: '#888', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.makeBtn(W / 2 - 190, H / 2 + 162, '↺ Reintentar', 0x5c1500, () => {
            this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20[this.sublevel - 1] });
        });
        this.makeBtn(W / 2, H / 2 + 162, '☰ Subniveles', 0x1a3d00, () => {
            this.scene.start('LevelSelect');
        });
        this.makeBtn(W / 2 + 190, H / 2 + 162, '🏠 Menú', 0x1a1a1a, () => {
            window.location.href = 'index.html';
        });
    }

    makeBtn(x, y, label, bg, cb) {
        const btn = this.add.rectangle(x, y, 160, 44, bg)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(1, 0xffffff33);
        this.add.text(x, y, label, {
            fontSize: '13px', fill: '#fff',
            fontFamily: 'Courier New', fontStyle: 'bold'
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
        width:           800,
        height:          600,
        parent:          'game-container',
        backgroundColor: '#1a0a00',
        scene:           [LevelSelect, PlayGame, ResultScreen]
    });
};