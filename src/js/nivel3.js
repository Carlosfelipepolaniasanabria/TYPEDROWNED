// ===================================================
//  nivel3.js — Nivel 3: Luna
//  Objetivo: 70 WPM
//  Subniveles desbloqueables con localStorage
// ===================================================

class LevelSelect extends Phaser.Scene {
    constructor() { super({ key: 'LevelSelect' }); }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        this.maxUnlocked = parseInt(localStorage.getItem('n3_max') || '1');

        this.add.rectangle(W / 2, H / 2, W, H, 0x00001a);

        this.add.text(W / 2, 38, 'NIVEL 3 — LUNA', {
            fontSize: '26px', fill: '#a0a8ff',
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, 68, 'Objetivo: 70 palabras por minuto', {
            fontSize: '13px', fill: '#4a4a8a', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.add.text(W / 2, 88, 'Selecciona un subnivel', {
            fontSize: '13px', fill: '#444', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(20, 12, '← Menú', {
            fontSize: '15px', fill: '#aaa', fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });
        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#fff' }));
        menuBtn.on('pointerout',  () => menuBtn.setStyle({ fill: '#aaa' }));
        menuBtn.on('pointerdown', () => window.location.href = 'index.html');

        // Estrellas decorativas
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.5);
        for (let i = 0; i < 60; i++) {
            g.fillCircle(Math.random()*800, Math.random()*600, Math.random() < 0.7 ? 1 : 1.5);
        }

        for (let i = 0; i < 20; i++) {
            const col      = i % 5;
            const row      = Math.floor(i / 5);
            const x        = 130 + col * 135;
            const y        = 165 + row * 95;
            const unlocked = (i + 1) <= this.maxUnlocked;
            const bgColor  = unlocked ? 0x1a1a5e : 0x1a1a1a;
            const txtColor = unlocked ? '#a0a8ff' : '#444444';

            const btn = this.add.rectangle(x, y, 110, 60, bgColor)
                .setStrokeStyle(2, unlocked ? 0x6666ff : 0x333333);

            if (unlocked) {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerover', () => btn.setFillStyle(0x2a2a8e));
                btn.on('pointerout',  () => btn.setFillStyle(bgColor));
                btn.on('pointerdown', () => {
                    this.scene.start('PlayGame', { sublevel: i + 1, word: words20_n3[i] });
                });
            }

            this.add.text(x, y - 9, `Subnivel ${i + 1}`, {
                fontSize: '13px', fill: txtColor,
                fontFamily: 'Courier New', fontStyle: 'bold'
            }).setOrigin(0.5);

            this.add.text(x, y + 12, unlocked ? '▶ JUGAR' : '🔒', {
                fontSize: '11px', fill: unlocked ? '#a0a8ff' : '#333',
                fontFamily: 'Courier New'
            }).setOrigin(0.5);
        }
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

        this.add.rectangle(W / 2, H / 2, W, H, 0x00001a);

        // Estrellas
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.4);
        for (let i = 0; i < 80; i++) {
            g.fillCircle(Math.random()*800, Math.random()*600, Math.random() < 0.7 ? 1 : 1.5);
        }

        this.add.text(W / 2, 28, `SUBNIVEL ${this.sublevel} — Luna | Meta: 70 WPM`, {
            fontSize: '16px', fill: '#a0a8ff',
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        const back = this.add.text(16, 12, '← Volver', {
            fontSize: '14px', fill: '#aaa', fontFamily: 'Courier New'
        }).setInteractive({ useHandCursor: true });
        back.on('pointerover', () => back.setStyle({ fill: '#fff' }));
        back.on('pointerout',  () => back.setStyle({ fill: '#aaa' }));
        back.on('pointerdown', () => { this.cleanup(); this.scene.start('LevelSelect'); });

        this.timerPhaserText = this.add.text(W - 16, 12, '⏱ Escribe para iniciar', {
            fontSize: '14px', fill: '#555', fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(1, 0);

        this.wpmPhaserText = this.add.text(16, 38, 'WPM: 0', {
            fontSize: '14px', fill: '#66ccff', fontFamily: 'Courier New'
        });
        this.accPhaserText = this.add.text(16, 58, 'Precisión: 100%', {
            fontSize: '14px', fill: '#aaaaff', fontFamily: 'Courier New'
        });

        this.add.text(W - 16, 38, '🎯 Meta: 70 WPM', {
            fontSize: '13px', fill: '#4a4a8a', fontFamily: 'Courier New'
        }).setOrigin(1, 0);

        this.add.text(W / 2, 82, 'Escribe la frase exactamente como aparece:', {
            fontSize: '12px', fill: '#444', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        // Barra de progreso
        this.add.rectangle(W / 2, H - 28, W - 60, 14, 0x0a0a2a).setOrigin(0.5);
        this.progressBar  = this.add.rectangle(30, H - 28, 2, 10, 0x4444cc).setOrigin(0, 0.5);
        this.progressMaxW = W - 60;
        this.progressPct  = this.add.text(W / 2, H - 28, '0%', {
            fontSize: '10px', fill: '#555', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.hintText = this.add.text(W / 2, H - 58, '🖱 Haz clic en la pantalla para escribir', {
            fontSize: '12px', fill: '#333', fontFamily: 'Courier New'
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

        this.phraseEl = document.createElement('div');
        Object.assign(this.phraseEl.style, {
            fontFamily:    '"Courier New", monospace',
            fontSize:      `${Math.round(18 * scaleX)}px`,
            lineHeight:    '1.9',
            background:    'rgba(0,0,10,0.75)',
            border:        '1px solid #1a1a4e',
            borderRadius:  '8px',
            padding:       '22px 28px',
            maxWidth:      `${Math.round(720 * scaleX)}px`,
            width:         '90%',
            textAlign:     'left',
            letterSpacing: '1px',
            wordBreak:     'break-word',
            userSelect:    'none',
            boxShadow:     'inset 0 0 24px rgba(0,0,30,0.6)',
        });
        this.renderPhrase();
        this.overlay.appendChild(this.phraseEl);

        // Input invisible
        this.inputEl = document.createElement('input');
        Object.assign(this.inputEl.style, {
            position: 'fixed', top: '-9999px', left: '-9999px',
            opacity: '0', width: '1px', height: '1px',
            border: 'none', outline: 'none', pointerEvents: 'all',
        });
        this.inputEl.setAttribute('autocomplete', 'off');
        this.inputEl.setAttribute('autocorrect', 'off');
        this.inputEl.setAttribute('autocapitalize', 'none');
        this.inputEl.setAttribute('spellcheck', 'false');

        this.inputEl.addEventListener('input',   () => this.onInput());
        this.inputEl.addEventListener('paste',   e  => e.preventDefault());
        this.inputEl.addEventListener('keydown', e  => { if (this.finished) e.preventDefault(); });

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
                html += typed[i] === target[i]
                    ? `<span style="color:#8888ff">${display}</span>`
                    : ch === ' '
                        ? `<span style="color:#ff4444;text-decoration:underline">&nbsp;</span>`
                        : `<span style="color:#ff4444;background:rgba(255,0,0,0.12)">${ch}</span>`;
            } else if (i === typed.length) {
                html += `<span style="color:#fff;border-bottom:2px solid #a0a8ff;padding-bottom:1px">${display}</span>`;
            } else {
                html += `<span style="color:#2a2a4a">${display}</span>`;
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
            const col = wpm >= 70 ? '#8888ff' : wpm >= 50 ? '#ffdd55' : '#66ccff';
            this.wpmPhaserText.setStyle({ fill: col });
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

        const typed   = this.typed;
        const target  = this.targetText;
        let   correct = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++;
        }
        const acc      = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0;
        const elapsed  = this.startTime ? (Date.now() - this.startTime) / 60000 : 1/60;
        const words    = typed.trim().split(/\s+/).filter(Boolean).length;
        const wpm      = elapsed > 0 ? Math.round(words / elapsed) : 0;
        const timeUsed = 60 - this.timeLeft;

        // Desbloquear siguiente subnivel
        if (won) {
            const current = parseInt(localStorage.getItem('n3_max') || '1');
            if (this.sublevel >= current && this.sublevel < 20) {
                localStorage.setItem('n3_max', this.sublevel + 1);
            }
        }

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

        this.add.rectangle(W / 2, H / 2, W, H, 0x00000f);

        // Estrellas de fondo
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 0.3);
        for (let i = 0; i < 60; i++) g.fillCircle(Math.random()*800, Math.random()*600, 1);

        const pW = 520, pH = 400;
        const panel = this.add.rectangle(W / 2, H / 2, pW, pH, 0x05051a);
        panel.setStrokeStyle(2, this.won ? 0xa0a8ff : 0xff4444);

        const metaAlcanzada = this.wpm >= 70;
        let icon, title, color;

        if (this.won && metaAlcanzada) {
            icon = '🌙'; title = '¡LLEGASTE A LA LUNA!'; color = '#a0a8ff';
        } else if (this.won && !metaAlcanzada) {
            icon = '✅'; title = '¡FRASE COMPLETA!'; color = '#ffdd55';
        } else {
            icon = '⏰'; title = 'TIEMPO AGOTADO'; color = '#ff4444';
        }

        this.add.text(W / 2, H / 2 - 168, icon,  { fontSize: '40px' }).setOrigin(0.5);
        this.add.text(W / 2, H / 2 - 125, title, {
            fontSize: '26px', fill: color,
            fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 94, `Subnivel ${this.sublevel} — Luna`, {
            fontSize: '14px', fill: '#a0a8ff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const wpmColor = this.wpm >= 70 ? '#a0a8ff' : '#ff8844';
        this.add.text(W / 2, H / 2 - 74, `${this.wpm} WPM ${this.wpm >= 70 ? '✓ Meta alcanzada' : '✗ Meta: 70 WPM'}`, {
            fontSize: '15px', fill: wpmColor, fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.rectangle(W / 2, H / 2 - 55, pW - 60, 1, 0x1a1a4e);

        const rows = [
            ['⌛ Tiempo',    `${this.timeUsed}s de 60s`],
            ['⚡ Velocidad', `${this.wpm} WPM`],
            ['🎯 Precisión', `${this.acc}%`],
            ['✅ Correctas', `${this.correct} / ${this.total} letras`],
        ];

        rows.forEach(([lbl, val], i) => {
            const y = H / 2 - 32 + i * 42;
            if (i % 2 === 0) this.add.rectangle(W / 2, y + 8, pW - 60, 32, 0x0a0a28).setOrigin(0.5);
            this.add.text(W / 2 - 190, y, lbl, { fontSize: '14px', fill: '#888', fontFamily: 'Courier New' });
            this.add.text(W / 2 + 185, y, val, { fontSize: '14px', fill: '#fff', fontFamily: 'Courier New', fontStyle: 'bold' }).setOrigin(1, 0);
        });

        this.add.rectangle(W / 2, H / 2 + 108, pW - 60, 1, 0x1a1a4e);

        const msg = this.won
            ? (metaAlcanzada ? '¡Excelente! Siguiente subnivel desbloqueado.' : 'Completo pero mejora tu velocidad.')
            : '¡Sigue practicando, llegarás a la luna!';
        this.add.text(W / 2, H / 2 + 126, msg, { fontSize: '12px', fill: '#555', fontFamily: 'Courier New' }).setOrigin(0.5);

        this.makeBtn(W / 2 - 190, H / 2 + 162, '↺ Reintentar', 0x1a1a5e, () => {
            this.scene.start('PlayGame', { sublevel: this.sublevel, word: words20_n3[this.sublevel - 1] });
        });
        this.makeBtn(W / 2, H / 2 + 162, '☰ Subniveles', 0x0d0d3a, () => {
            this.scene.start('LevelSelect');
        });
        this.makeBtn(W / 2 + 190, H / 2 + 162, '🏠 Menú', 0x1a1a1a, () => {
            window.location.href = 'index.html';
        });

        if (this.won && this.sublevel < 20) {
            this.makeBtn(W / 2, H / 2 + 210, `▶ Subnivel ${this.sublevel + 1}`, 0x2a2a8e, () => {
                this.scene.start('PlayGame', { sublevel: this.sublevel + 1, word: words20_n3[this.sublevel] });
            });
        }
    }

    makeBtn(x, y, label, bg, cb) {
        const btn = this.add.rectangle(x, y, 160, 42, bg)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(1, 0xffffff22);
        this.add.text(x, y, label, { fontSize: '13px', fill: '#fff', fontFamily: 'Courier New', fontStyle: 'bold' }).setOrigin(0.5);
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
        backgroundColor: '#00000f',
        scene:           [LevelSelect, PlayGame, ResultScreen]
    });
};