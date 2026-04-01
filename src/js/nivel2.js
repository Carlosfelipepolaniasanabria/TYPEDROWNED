
class LevelSelect extends Phaser.Scene {
    constructor() { super({ key: 'LevelSelect' }); }
    create() {
        this.add.text(400, 30, 'Selecciona un Subnivel (1 - 20)', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(50, 20, '< Menú').setInteractive().on('pointerdown', () => window.location.href = 'index.html');

        for (let i = 0; i < 20; i++) {
            let x = 150 + (i % 5) * 125;
            let y = 150 + Math.floor(i / 5) * 80;
            let btn = this.add.rectangle(x, y, 100, 50, 0x2d8a30).setInteractive();
            this.add.text(x, y, `Nivel ${i+1}`, { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
            btn.on('pointerdown', () => this.scene.start('PlayGame', { sublevel: i + 1, word: words20[i] }));
        }
    }
}


window.onload = () => new Phaser.Game({ type: Phaser.AUTO, width: 800, height: 600, parent: 'game-container', scene: [LevelSelect] });