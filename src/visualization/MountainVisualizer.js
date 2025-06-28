class MountainVisualizer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.crystals = [];
    this.snowflakes = [];
    this.resonanceWave = 0;
  }

  initialize(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this._setupCanvas();
    this._createParticles();
    this._animate();
  }

  _setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _createParticles() {
    // Create mountain particles
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
      });
    }
  }

  updateMountainState(state) {
    this.resonanceWave = state.harmonicState;
    this._updateCrystals(state.crystalFormation);
    this._updateSnowflakes(state.snowWhisper);
    this._updateParticles(state.mountainResonance);
  }

  _updateCrystals(formation) {
    if (formation > 0) {
      const crystalCount = Math.floor(formation * 10);
      while (this.crystals.length < crystalCount) {
        this.crystals.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 20 + 10,
          rotation: Math.random() * Math.PI * 2,
          color: `rgba(200, 255, 255, ${Math.random() * 0.3 + 0.7})`
        });
      }
    }
  }

  _updateSnowflakes(whisper) {
    if (whisper > 0) {
      const snowCount = Math.floor(whisper * 50);
      while (this.snowflakes.length < snowCount) {
        this.snowflakes.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 2 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
        });
      }
    }
  }

  _updateParticles(resonance) {
    this.particles.forEach(particle => {
      particle.speedX += Math.sin(this.resonanceWave) * 0.1;
      particle.speedY += Math.cos(this.resonanceWave) * 0.1;
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
    });
  }

  _animate() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });

    // Draw crystals
    this.crystals.forEach(crystal => {
      this.ctx.save();
      this.ctx.translate(crystal.x, crystal.y);
      this.ctx.rotate(crystal.rotation);
      this.ctx.beginPath();
      this.ctx.moveTo(0, -crystal.size);
      this.ctx.lineTo(crystal.size, crystal.size);
      this.ctx.lineTo(-crystal.size, crystal.size);
      this.ctx.closePath();
      this.ctx.fillStyle = crystal.color;
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw snowflakes
    this.snowflakes.forEach(snowflake => {
      this.ctx.beginPath();
      this.ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
      this.ctx.fillStyle = snowflake.color;
      this.ctx.fill();
      snowflake.y += snowflake.speed;
      if (snowflake.y > this.canvas.height) {
        snowflake.y = 0;
        snowflake.x = Math.random() * this.canvas.width;
      }
    });

    requestAnimationFrame(() => this._animate());
  }
}

module.exports = MountainVisualizer; 