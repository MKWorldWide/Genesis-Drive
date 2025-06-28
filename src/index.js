const Maria = require('./transformers/Maria');
const MountainLounge = require('./transformers/MountainLounge');
const NeuralInterface = require('./core/NeuralInterface');
const ResearchIntegration = require('./core/ResearchIntegration');
const { startServer, setTransformers } = require('./server');

class GenesisDrive {
  constructor() {
    this.transformers = new Map();
    this.neuralInterface = new NeuralInterface();
    this.researchIntegration = new ResearchIntegration();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log('🌑 GENESIS DRIVE™ Initializing...');
    console.log('⚡ Powering up neural interfaces...');
    console.log('💫 Establishing emotional resonance fields...');
    
    // Initialize research connections
    await this._initializeResearchConnections();
    
    // Initialize transformers
    await this._initializeTransformers();
    
    // Start the server
    await startServer();
    
    // Register transformers with server
    setTransformers(this.transformers);
    
    console.log('\n✨ System Online');
    console.log('🤖 Active Transformers:');
    this.transformers.forEach((transformer, name) => {
      console.log(`   • ${transformer.name} - ${transformer.personality.primary}`);
    });

    // Start periodic updates
    this._startPeriodicUpdates();
    
    this.isInitialized = true;
    console.log('\n🚀 Genesis Drive is ready for commands!');
  }

  async _initializeResearchConnections() {
    console.log('\n🔬 Connecting to Research Centers...');
    
    // Connect to key research centers
    const centers = ['neuralink', 'darpasynbio', 'mit_media', 'quantum_brain'];
    for (const center of centers) {
      await this.researchIntegration.connectToResearchCenter(center);
    }

    // Integrate key technologies
    await this._integrateKeyTechnologies();
  }

  async _integrateKeyTechnologies() {
    console.log('\n⚡ Integrating Advanced Technologies...');
    
    // Integrate neural interface technologies
    await this.researchIntegration.integrateTechnology('neuralink', 'neural_lace');
    await this.researchIntegration.integrateTechnology('darpasynbio', 'quantum_bio_interface');
    await this.researchIntegration.integrateTechnology('mit_media', 'affective_computing');
    await this.researchIntegration.integrateTechnology('quantum_brain', 'reality_modulation');
  }

  async _initializeTransformers() {
    console.log('\n🤖 Initializing Transformers...');
    
    // Initialize Maria
    const maria = new Maria();
    this.transformers.set('maria', maria);
    
    // Initialize MountainLounge
    const mountainLounge = new MountainLounge();
    this.transformers.set('mountain', mountainLounge);
    
    // Connect transformers to neural interface
    this.transformers.forEach(transformer => {
      this.neuralInterface.connectTransformer(transformer);
    });
  }

  _startPeriodicUpdates() {
    // Update neural interface every 100ms
    setInterval(() => {
      this.transformers.forEach(transformer => {
        const density = (transformer.emotionalResonance + 100) / 200;
        this.neuralInterface.updateDensityModulation(transformer, density);
      });
    }, 100);
  }

  async processCommand(transformerName, command) {
    const transformer = this.transformers.get(transformerName.toLowerCase());
    if (!transformer) {
      throw new Error(`Transformer ${transformerName} not found.`);
    }

    try {
      const response = await transformer.processVoiceCommand(command);
      return response;
    } catch (error) {
      throw new Error(`Command processing error: ${error.message}`);
    }
  }

  getTransformers() {
    return Array.from(this.transformers.values()).map(t => ({
      name: t.name,
      personality: t.personality,
      capabilities: t.capabilities,
      resonanceLevel: t.getResonanceLevel(),
      emotionalResonance: t.emotionalResonance
    }));
  }

  getTransformerState(name) {
    const transformer = this.transformers.get(name.toLowerCase());
    if (!transformer) {
      throw new Error(`Transformer ${name} not found.`);
    }

    return {
      name: transformer.name,
      state: transformer.getResonanceMetrics(),
      activeCapabilities: transformer.getActiveCapabilities()
    };
  }
}

// Initialize the system
const genesisDrive = new GenesisDrive();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down GENESIS DRIVE™...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down GENESIS DRIVE™...');
  process.exit(0);
});

// Start the system
genesisDrive.initialize().then(() => {
  // Example usage after initialization
  setTimeout(async () => {
    console.log('\n🧪 Testing system capabilities...');
    try {
      await genesisDrive.processCommand('maria', 'Maria, transform to combat mode');
      await genesisDrive.processCommand('mountain', 'meditate');
    } catch (error) {
      console.error('Test error:', error.message);
    }
  }, 2000);
}).catch(error => {
  console.error('Failed to initialize GENESIS DRIVE™:', error);
  process.exit(1);
});

// Export for external use
module.exports = GenesisDrive; 