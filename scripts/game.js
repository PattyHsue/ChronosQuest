/**
 * 時空能量球：全能冒險打磚塊 (Chronos Quest)
 * UTT-v2.0 Refactored Core - Xavier & Ada Architecture
 */

// --- 1. Audio Module ---
class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = this.ctx.createGain();
        this.masterVolume.connect(this.ctx.destination);
        this.masterVolume.gain.value = 0.3;
        this.muted = false;
        this.bpm = 90;
        this.step = 0;
        this.isPlaying = false;
    }

    toggleMute() {
        this.muted = !this.muted;
        this.masterVolume.gain.value = this.muted ? 0 : 0.3;
        return this.muted;
    }

    playCrystalHit(freq = 880) {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.masterVolume);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playWaterDrop() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.masterVolume);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    startBackgroundMusic() {
        if (this.isPlaying || this.muted) return;
        this.isPlaying = true;
        this.scheduler();
    }

    scheduler() {
        if (this.muted) { this.isPlaying = false; return; }
        const chords = [[440, 554, 659], [349, 440, 523], [392, 493, 587], [523, 659, 783]];
        const currentChord = chords[Math.floor(Date.now() / 2000) % chords.length];
        this.playPianoNote(currentChord[this.step % 3]);
        this.step++;
        setTimeout(() => this.scheduler(), (60 / this.bpm) * 1000);
    }

    playPianoNote(freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(this.masterVolume);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    }
}

// --- 2. Effect & Particle Module ---
class EffectManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.bgEffects = [];
    }

    createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                dx: (Math.random() - 0.5) * 5,
                dy: (Math.random() - 0.5) * 5,
                life: 1,
                color
            });
        }
    }

    update() {
        this.particles.forEach((p, i) => {
            p.x += p.dx; p.y += p.dy;
            p.life -= 0.02;
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        this.bgEffects.forEach(e => {
            e.x += e.dx || 0; e.y += e.dy || 0;
            if (e.type === 'bird') e.flap += e.flapSpeed || 0.1;
            if (e.type === 'nemo') e.wiggle += 0.15;
            if (e.x > this.canvas.width + 100) e.x = -100;
            if (e.x < -100) e.x = this.canvas.width + 100;
            if (e.y > this.canvas.height + 100) e.y = -100;
            if (e.y < -100) e.y = this.canvas.height + 100;
        });
    }

    draw() {
        this.bgEffects.forEach(e => {
            this.ctx.save();
            this.ctx.translate(e.x, e.y);
            if (e.type === 'bird') this.drawBird(e);
            else if (e.type === 'scorpio') this.drawScorpio(e);
            else if (e.type === 'nemo') this.drawNemo(e);
            else if (e.type === 'bubble') this.drawBubble(e);
            this.ctx.restore();
        });

        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillRect(p.x, p.y, 3, 3);
            this.ctx.globalAlpha = 1;
        });
    }

    drawBird(e) {
        if (e.dx < 0) this.ctx.scale(-1, 1);
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, e.size, e.size / 2.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        const flapOffset = Math.sin(e.flap) * e.size;
        this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2;
        this.ctx.beginPath(); this.ctx.moveTo(0, 0); this.ctx.quadraticCurveTo(0, -e.size, -e.size, flapOffset); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(0, 0); this.ctx.quadraticCurveTo(0, -e.size, e.size, flapOffset); this.ctx.stroke();
    }

    drawScorpio(e) {
        if (e.dx < 0) this.ctx.scale(-1, 1);
        this.ctx.fillStyle = '#442a0a';
        this.ctx.beginPath(); this.ctx.ellipse(0, 0, e.size / 1.5, e.size / 3, 0, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.strokeStyle = '#442a0a'; this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.moveTo(-e.size / 2, 0); this.ctx.bezierCurveTo(-e.size, -e.size, 0, -e.size * 1.5, e.size / 2, -e.size / 2); this.ctx.stroke();
    }

    drawNemo(e) {
        if (e.dx < 0) this.ctx.scale(-1, 1);
        const wiggle = Math.sin(e.wiggle) * 2;
        this.ctx.fillStyle = '#ff6600';
        this.ctx.beginPath(); this.ctx.ellipse(0, wiggle, e.size, e.size / 1.8, 0, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(-e.size / 3, wiggle - e.size / 2, e.size / 4, e.size);
        this.ctx.fillRect(e.size / 4, wiggle - e.size / 2, e.size / 4, e.size);
        this.ctx.fillStyle = '#000'; this.ctx.beginPath(); this.ctx.arc(e.size * 0.6, wiggle - 2, 2, 0, Math.PI * 2); this.ctx.fill();
    }

    drawBubble(e) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${e.opacity})`;
        this.ctx.beginPath(); this.ctx.arc(0, 0, e.size, 0, Math.PI * 2); this.ctx.stroke();
    }
}

// --- 3. Scene & Logic Manager ---
class SceneManager {
    constructor(game) {
        this.game = game;
        this.themes = [
            { name: '翠綠森林', id: 'forest', bg: 'assets/forest_bg.png', boss: 'assets/forest_boss.png' },
            { name: '黃金沙漠', id: 'desert', bg: 'assets/desert_bg.png', boss: 'assets/desert_boss.png' },
            { name: '碧藍深海', id: 'ocean', bg: 'assets/ocean_bg.png', boss: 'assets/ocean_boss.png' }
        ];
    }

    initTheme(level) {
        const theme = this.themes[level - 1];
        document.body.className = `theme-${theme.id}`;
        document.getElementById('level-name').textContent = theme.name;
        this.game.bgImg = new Image();
        this.game.bgImg.src = theme.bg;
        this.initBgEffects(theme.id);
        this.createBricks(level);
    }

    initBgEffects(themeId) {
        const effects = [];
        if (themeId === 'forest') {
            for (let i = 0; i < 6; i++) effects.push({ type: 'bird', x: Math.random() * 1000, y: 100 + Math.random() * 200, dx: 2 + Math.random() * 3, dy: (Math.random() - 0.5), size: 15 + Math.random() * 5, flap: 0, flapSpeed: 0.1 + Math.random() * 0.1 });
        } else if (themeId === 'desert') {
            for (let i = 0; i < 5; i++) effects.push({ type: 'scorpio', x: Math.random() * 1000, y: 600 + Math.random() * 50, dx: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random()), dy: 0, size: 20 + Math.random() * 10 });
        } else if (themeId === 'ocean') {
            for (let i = 0; i < 8; i++) effects.push({ type: 'nemo', x: Math.random() * 1000, y: Math.random() * 700, dx: (1 + Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1), dy: (Math.random() - 0.5) * 0.5, size: 18 + Math.random() * 8, wiggle: 0 });
            for (let i = 0; i < 15; i++) effects.push({ type: 'bubble', x: Math.random() * 1000, y: 700 + Math.random() * 200, dy: -(0.5 + Math.random() * 1.5), size: 4 + Math.random() * 8, opacity: 0.1 + Math.random() * 0.3 });
        }
        this.game.effects.bgEffects = effects;
    }

    createBricks(level) {
        const bricks = [];
        const rows = 3 + level; const cols = 8;
        const w = 100; const h = 25; const padding = 20;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                bricks.push({ x: (c * (w + padding)) + 50, y: (r * (h + padding)) + 110, w, h, active: true });
            }
        }
        this.game.bricks = bricks;
    }
}

// --- 4. Main Game Core ---
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1000; this.canvas.height = 700;

        this.audio = new AudioManager();
        this.effects = new EffectManager(this.canvas, this.ctx);
        this.scenes = new SceneManager(this);

        this.state = 'START';
        this.level = 1; this.score = 0; this.lives = 3;
        this.isAutoPlay = false;

        this.paddle = { x: 450, y: 650, w: 120, h: 15, color: '#00ff88' };
        this.ball = { x: 500, y: 640, r: 8, dx: 4, dy: -4, speed: 7 };
        this.bricks = [];
        this.boss = null;

        this.keys = { left: false, right: false };
        this.setupEvents();
        this.scenes.initTheme(this.level);
        this.loop();
    }

    setupEvents() {
        const handleMove = (x) => {
            if (this.isAutoPlay) return;
            const rect = this.canvas.getBoundingClientRect();
            this.paddle.x = (x - rect.left) / (rect.width / this.canvas.width) - this.paddle.w / 2;
        };

        this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
        }, { passive: false });

        window.addEventListener('keydown', (e) => { if (['a', 'A', 'ArrowLeft'].includes(e.key)) this.keys.left = true; if (['d', 'D', 'ArrowRight'].includes(e.key)) this.keys.right = true; });
        window.addEventListener('keyup', (e) => { if (['a', 'A', 'ArrowLeft'].includes(e.key)) this.keys.left = false; if (['d', 'D', 'ArrowRight'].includes(e.key)) this.keys.right = false; });

        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.querySelectorAll('.lvl-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.level = parseInt(btn.dataset.level);
                this.scenes.initTheme(this.level);
                document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('start-btn').style.display = 'inline-block';
            });
        });

        document.getElementById('audio-toggle').addEventListener('click', (e) => {
            const muted = this.audio.toggleMute();
            e.target.textContent = muted ? '🔇 靜音' : '🔊 音樂';
        });

        document.getElementById('auto-play-toggle').addEventListener('click', (e) => {
            this.isAutoPlay = !this.isAutoPlay;
            e.target.textContent = this.isAutoPlay ? '🤖 自動: ON' : '🤖 自動: OFF';
        });
    }

    startGame() {
        this.state = 'PLAYING';
        document.getElementById('overlay').classList.remove('active');
        document.querySelector('.level-selector').classList.add('hidden');
        if (this.audio.ctx.state === 'suspended') this.audio.ctx.resume();
        this.audio.startBackgroundMusic();
        this.resetBall();
    }

    resetBall() {
        this.ball.x = this.paddle.x + this.paddle.w / 2;
        this.ball.y = this.paddle.y - 10;
        this.ball.dx = (Math.random() - 0.5) * 8;
        this.ball.dy = -this.ball.speed;
    }

    update() {
        if (this.state === 'PAUSED' || this.state === 'OVER') return;
        this.effects.update();

        if (this.isAutoPlay) {
            this.paddle.x += (this.ball.x - this.paddle.w / 2 - this.paddle.x) * 0.15;
        } else {
            if (this.keys.left) this.paddle.x -= 12;
            if (this.keys.right) this.paddle.x += 12;
        }
        if (this.paddle.x < 0) this.paddle.x = 0;
        if (this.paddle.x > 1000 - this.paddle.w) this.paddle.x = 1000 - this.paddle.w;

        if (this.state === 'START') return;

        // Ball physics
        this.ball.x += this.ball.dx; this.ball.y += this.ball.dy;

        // Wall collisions
        if (this.ball.x < 0 || this.ball.x > 1000) this.ball.dx *= -1;
        if (this.ball.y < 0) this.ball.dy *= -1;

        // Paddle collision
        if (this.ball.y + this.ball.r > this.paddle.y && this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.w) {
            this.ball.dy = -Math.abs(this.ball.dy);
            this.ball.dx = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) * 0.15;
            this.audio.playWaterDrop();
            this.effects.createParticles(this.ball.x, this.ball.y, '#00ff88');
        }

        // Brick collision
        this.bricks.forEach(b => {
            if (b.active && this.ball.x > b.x && this.ball.x < b.x + b.w && this.ball.y > b.y && this.ball.y < b.y + b.h) {
                b.active = false; this.ball.dy *= -1; this.score += 10;
                this.audio.playCrystalHit();
                this.effects.createParticles(b.x + b.w / 2, b.y + b.h / 2, '#fff');
                document.getElementById('score').textContent = this.score;
            }
        });

        // Life lost
        if (this.ball.y > 700) {
            this.lives--;
            document.getElementById('lives').textContent = this.lives;
            if (this.lives <= 0) this.state = 'OVER'; else this.resetBall();
        }

        // Boss logic
        const activeBricks = this.bricks.filter(b => b.active).length;
        if (activeBricks === 0 && !this.boss && this.state === 'PLAYING') {
            this.initBoss();
        }

        if (this.boss) {
            this.boss.floatPhase += 0.04;
            this.boss.pulsePhase += 0.03;
            if (this.boss.hitCooldown > 0) this.boss.hitCooldown -= 1;
            
            let speedMod = this.boss.hp < 40 ? 1.8 : 1.0; 
            this.boss.x += this.boss.dx * speedMod;
            if (this.boss.x < 50 || this.boss.x + this.boss.w > 950) this.boss.dx *= -1;

            if (Math.random() > 0.9) {
                const colors = ['#4a6e2f', '#d4af37', '#0077be']; 
                this.effects.createParticles(this.boss.x + Math.random() * this.boss.w, this.boss.y + this.boss.h, colors[this.level-1], 1);
            }

            if (this.ball.x + this.ball.r > this.boss.x && 
                this.ball.x - this.ball.r < this.boss.x + this.boss.w &&
                this.ball.y + this.ball.r > this.boss.y && 
                this.ball.y - this.ball.r < this.boss.y + this.boss.h) {
                
                this.boss.hp -= 2; 
                this.boss.hitCooldown = 15;
                this.ball.dy *= -1.02;
                this.audio.playCrystalHit(400); 
                
                const hpBar = document.getElementById('boss-hp');
                if (hpBar) hpBar.style.width = this.boss.hp + '%';
                
                this.effects.createParticles(this.ball.x, this.ball.y, '#ff0077', 12);

                if (this.boss.hp <= 0) {
                    this.score += 1000;
                    document.getElementById('score').textContent = this.score;
                    this.boss = null;
                    document.getElementById('boss-hud').classList.add('hidden');
                    setTimeout(() => {
                        this.level++;
                        if (this.level > 3) this.level = 1;
                        this.scenes.initTheme(this.level);
                        this.state = 'PLAYING';
                        this.resetBall();
                    }, 2000);
                }
            }
        }
    }

    initBoss() {
        this.state = 'BOSS';
        this.boss = { 
            x: 375, y: 80, w: 250, h: 250, 
            hp: 100, dx: 1.5, 
            img: new Image(),
            floatPhase: 0,
            pulsePhase: 0,
            hitCooldown: 0
        };
        this.boss.img.src = this.scenes.themes[this.level - 1].boss;
        document.getElementById('boss-hud').classList.remove('hidden');
        document.getElementById('boss-hp').style.width = '100%';
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    draw() {
        this.ctx.clearRect(0, 0, 1000, 700);
        if (this.bgImg) this.ctx.drawImage(this.bgImg, 0, 0, 1000, 700);
        this.effects.draw();

        // Draw Bricks
        this.bricks.forEach(b => {
            if (b.active) {
                this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
                this.ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });

        // Draw Boss (Restored Professional Visuals)
        if (this.boss) {
            const bx = this.boss.x;
            const floatAmp = this.level === 3 ? 20 : 10; 
            const by = this.boss.y + Math.sin(this.boss.floatPhase) * floatAmp; 
            const pulse = 1 + Math.sin(this.boss.pulsePhase) * 0.04;     
            const bw = this.boss.w * pulse;
            const bh = this.boss.h * pulse;
            const centerX = bx + this.boss.w / 2;
            const isRage = this.boss.hp < 40;
            
            // 1. 動態多重陰影 (Dynamic Multi-Shadow)
            this.ctx.fillStyle = isRage ? 'rgba(100, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, 680, 90 * pulse, 12, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // 2. 核心氣場 (Core Aura) - 向量化漸層
            this.ctx.save();
            const themeColors = ['#00ff88', '#ffcc00', '#00d4ff'];
            const auraColor = isRage ? '#ff0000' : themeColors[this.level - 1]; 
            const glowSize = 180 * pulse;
            const grad = this.ctx.createRadialGradient(centerX, by + bh/2, 0, centerX, by + bh/2, glowSize);
            grad.addColorStop(0, auraColor + '55');
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.beginPath(); this.ctx.arc(centerX, by + bh/2, glowSize, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.restore();

            // 3. 主體及其受擊震撼 (Hit Recoil) & 邊緣淨化 (Edge Cleanup)
            this.ctx.save();
            let shakeX = 0;
            this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
            this.ctx.shadowBlur = 8; 
            if (this.boss.hitCooldown > 0) {
                shakeX = (Math.random() - 0.5) * 15;
                this.ctx.filter = 'brightness(1.5) contrast(1.2)'; 
            }
            if (isRage && Math.random() > 0.8) {
                this.ctx.filter = 'drop-shadow(0 0 15px #ff0000) hue-rotate(-20deg)'; 
            }
            this.ctx.drawImage(this.boss.img, bx + (this.boss.w - bw)/2 + shakeX, by + (this.boss.h - bh)/2, bw, bh);
            this.ctx.restore();

            // 4. HP 條小提示 (On-Boss UI)
            if (isRage) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.font = 'bold 16px "JetBrains Mono"';
                this.ctx.textAlign = 'center';
                this.ctx.fillText("!!!! RAGE MODE !!!!", centerX, by - 20);
            }
        }

        // Draw Paddle & Ball
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);
        this.ctx.beginPath(); this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff'; this.ctx.fill();
    }
}

// Start Game
window.onload = () => new Game();
