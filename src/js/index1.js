/* ===== js/index.js — TypeDrowned Menú Principal ===== */

// Detectar ruta base para navegar correctamente con file://
function goTo(page) {
  var loc = window.location.href;
  var base = loc.substring(0, loc.lastIndexOf('/') + 1);
  // Si estamos en /templates/, apuntar al mismo folder
  window.location.href = base + page;
}

// ─── Escena del Menú ─────────────────────────────────────────────────────────
var MenuScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function MenuScene() {
    Phaser.Scene.call(this, { key: 'MenuScene' });
  },

  preload: function () {
    // Sin recursos externos — todo se dibuja con gráficos
  },

  create: function () {
    var W = this.scale.width;
    var H = this.scale.height;

    // ── Fondo degradado estrellado ──────────────────────────────────────────
    var bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x1a0a3e, 0x1a0a3e, 1);
    bg.fillRect(0, 0, W, H);

    // Estrellas aleatorias
    var stars = this.add.graphics();
    stars.fillStyle(0xffffff, 1);
    for (var i = 0; i < 200; i++) {
      var sx = Phaser.Math.Between(0, W);
      var sy = Phaser.Math.Between(0, H);
      var sr = Math.random() * 1.5 + 0.2;
      stars.fillCircle(sx, sy, sr);
    }

    // ── Panel central con borde neón ────────────────────────────────────────
    var panelW = 520, panelH = 480;
    var px = (W - panelW) / 2, py = (H - panelH) / 2;

    var panel = this.add.graphics();
    panel.fillStyle(0x0d0d2b, 0.92);
    panel.fillRoundedRect(px, py, panelW, panelH, 18);
    panel.lineStyle(2, 0x00f5ff, 0.9);
    panel.strokeRoundedRect(px, py, panelW, panelH, 18);

    // Brillo interior sutil
    var glow = this.add.graphics();
    glow.fillStyle(0x00f5ff, 0.04);
    glow.fillRoundedRect(px + 2, py + 2, panelW - 4, panelH - 4, 16);

    // ── Título ──────────────────────────────────────────────────────────────
    var title = this.add.text(W / 2, py + 62, 'TYPEDROWNED', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#00f5ff',
      stroke: '#003344',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#00f5ff', blur: 18, fill: true }
    }).setOrigin(0.5, 0.5);

    // ── Ícono del muñeco ─────────────────────────────────────────────────────
    this._drawCharacter(this, W / 2, py + 175, 0x00ff88, 28);

    // ── Botones de nivel ─────────────────────────────────────────────────────
    var levels = [
      { label: '⛏  Nivel 1 — Subsuelo',  color: 0xff8c42, glow: '#ff8c42', file: 'nivel1.html' },
      { label: '🌿  Nivel 2 — Superficie', color: 0x44dd88, glow: '#44dd88', file: 'nivel2.html' },
      { label: '🚀  Nivel 3 — Luna',       color: 0x44aaff, glow: '#44aaff', file: 'nivel3.html' },
    ];

    var btnW = 340, btnH = 52, btnX = W / 2 - btnW / 2;
    var startY = py + 240;

    for (var i = 0; i < levels.length; i++) {
      (function (lvl, idx) {
        var by = startY + idx * 72;

        var btnBg = this.add.graphics();
        btnBg.fillStyle(lvl.color, 0.18);
        btnBg.fillRoundedRect(btnX, by, btnW, btnH, 10);
        btnBg.lineStyle(2, lvl.color, 0.85);
        btnBg.strokeRoundedRect(btnX, by, btnW, btnH, 10);

        var btnText = this.add.text(W / 2, by + btnH / 2, lvl.label, {
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '20px',
          fontStyle: 'bold',
          color: '#ffffff',
          shadow: { offsetX: 0, offsetY: 0, color: lvl.glow, blur: 10, fill: true }
        }).setOrigin(0.5, 0.5);

        // Zona interactiva
        var zone = this.add.zone(W / 2, by + btnH / 2, btnW, btnH).setInteractive({ useHandCursor: true });

        zone.on('pointerover', function () {
          btnBg.clear();
          btnBg.fillStyle(lvl.color, 0.38);
          btnBg.fillRoundedRect(btnX, by, btnW, btnH, 10);
          btnBg.lineStyle(2, lvl.color, 1);
          btnBg.strokeRoundedRect(btnX, by, btnW, btnH, 10);
        });

        zone.on('pointerout', function () {
          btnBg.clear();
          btnBg.fillStyle(lvl.color, 0.18);
          btnBg.fillRoundedRect(btnX, by, btnW, btnH, 10);
          btnBg.lineStyle(2, lvl.color, 0.85);
          btnBg.strokeRoundedRect(btnX, by, btnW, btnH, 10);
        });

        zone.on('pointerdown', function () {
          goTo(lvl.file);
        });

      }.bind(this))(levels[i], i);
    }

    // ── Animación parpadeante del título ─────────────────────────────────────
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.7 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // ── Línea inferior ───────────────────────────────────────────────────────
    this.add.text(W / 2, py + panelH - 22, 'Presiona un nivel para comenzar', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '12px',
      color: '#445566',
    }).setOrigin(0.5, 0.5);
  },

  // Dibuja un muñeco stick figure
  _drawCharacter: function (scene, cx, cy, color, scale) {
    var g = scene.add.graphics();
    var s = scale / 20; // factor de escala relativo a 20
    g.lineStyle(3 * s * (20 / scale) + 1.5, color, 1);
    g.strokeCircle(cx, cy - 22 * s * (20 / scale), 9 * s * (20 / scale)); // cabeza
    g.strokeRect(0, 0, 0, 0); // reset
    g.lineStyle(2.5, color, 1);
    // Cuerpo
    g.beginPath(); g.moveTo(cx, cy - 13 * (scale / 20)); g.lineTo(cx, cy + 10 * (scale / 20)); g.strokePath();
    // Brazos
    g.beginPath(); g.moveTo(cx, cy - 5 * (scale / 20)); g.lineTo(cx - 12 * (scale / 20), cy + 4 * (scale / 20)); g.strokePath();
    g.beginPath(); g.moveTo(cx, cy - 5 * (scale / 20)); g.lineTo(cx + 12 * (scale / 20), cy + 4 * (scale / 20)); g.strokePath();
    // Piernas
    g.beginPath(); g.moveTo(cx, cy + 10 * (scale / 20)); g.lineTo(cx - 10 * (scale / 20), cy + 26 * (scale / 20)); g.strokePath();
    g.beginPath(); g.moveTo(cx, cy + 10 * (scale / 20)); g.lineTo(cx + 10 * (scale / 20), cy + 26 * (scale / 20)); g.strokePath();
  }
});

// ─── Iniciar Phaser ───────────────────────────────────────────────────────────
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0a0a1a',
  parent: 'game-container',
  scene: [MenuScene]
};

var game = new Phaser.Game(config);
