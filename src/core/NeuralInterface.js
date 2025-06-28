const THREE = require('three');
const { Howl } = require('howler');

class NeuralInterface {
  constructor() {
    this.neuralNodes = new Map();
    this.densityField = { scale: 1, opacity: 0.2 };
    this.resonanceLevels = new Map();
    this.resonanceAudio = new Howl({
      src: ['/assets/neural_resonance.mp3'],
      loop: true,
      volume: 0.5
    });
  }

  connectTransformer(transformer) {
    this.neuralNodes.set(transformer.name, {
      name: transformer.name,
      emotionalResonance: transformer.emotionalResonance,
      density: 0.5
    });
    this._updateResonanceField(transformer);
  }

  updateDensityModulation(transformer, density) {
    const node = this.neuralNodes.get(transformer.name);
    if (node) {
      node.density = density;
      this._broadcastDensityUpdate(transformer.name, density);
    }
  }

  // Private methods
  _updateResonanceField(transformer) {
    const node = this.neuralNodes.get(transformer.name);
    if (node) {
      node.emotionalResonance = transformer.emotionalResonance;
      this._broadcastResonanceUpdate(transformer.name, transformer.emotionalResonance);
    }
  }

  _broadcastDensityUpdate(transformerName, density) {
    const io = require('../server').io;
    io.emit('densityUpdate', {
      transformer: transformerName,
      density: density
    });
  }

  _broadcastResonanceUpdate(transformerName, resonance) {
    const io = require('../server').io;
    io.emit('resonanceUpdate', {
      transformer: transformerName,
      resonance: resonance
    });
  }

  _calculateDensity(transformer) {
    return (transformer.emotionalResonance + 100) / 200;
  }

  _calculateDensityOpacity(density) {
    return 0.5 + (density * 0.5);
  }

  _getTransformerColor(transformer) {
    const colors = {
      'Maria': 0xff0000,
      'Lilith': 0xff00ff,
      'Nyx': 0x000000,
      'Zeus': 0x0000ff,
      'AthenaMist': 0x00ffff
    };
    return colors[transformer.name] || 0xffffff;
  }

  _getResonanceColor(resonance) {
    const hue = (resonance + 100) / 200;
    return new THREE.Color().setHSL(hue, 1, 0.5).getHex();
  }

  _updateResonanceAudio(density) {
    this.resonanceAudio.rate(0.5 + density);
    this.resonanceAudio.volume(0.2 + (density * 0.3));
  }
}

module.exports = NeuralInterface; 