const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.initialized = false;
    this.transformers = new Map();
  }

  initialize() {
    if (this.initialized) return;

    // Security middleware
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Serve static files
    this.app.use(express.static(path.join(__dirname, '../public')));

    // API Routes
    this._setupAPIRoutes();

    // WebSocket connection handling
    this._setupWebSocket();

    this.initialized = true;
  }

  _setupAPIRoutes() {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // Get all transformers
    this.app.get('/api/transformers', (req, res) => {
      const transformers = Array.from(this.transformers.values()).map(t => ({
        name: t.name,
        personality: t.personality,
        capabilities: t.capabilities,
        resonanceLevel: t.getResonanceLevel(),
        emotionalResonance: t.emotionalResonance
      }));
      res.json(transformers);
    });

    // Send command to transformer
    this.app.post('/api/transformers/:name/command', async (req, res) => {
      const { name } = req.params;
      const { command } = req.body;

      const transformer = this.transformers.get(name.toLowerCase());
      if (!transformer) {
        return res.status(404).json({ error: 'Transformer not found' });
      }

      try {
        const response = await transformer.processVoiceCommand(command);
        res.json({ response, transformer: name });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get resonance levels
    this.app.get('/api/resonance', (req, res) => {
      const resonance = Array.from(this.transformers.values()).map(t => ({
        name: t.name,
        metrics: t.getResonanceMetrics()
      }));
      res.json(resonance);
    });

    // Get specific transformer state
    this.app.get('/api/transformers/:name/state', (req, res) => {
      const { name } = req.params;
      const transformer = this.transformers.get(name.toLowerCase());
      
      if (!transformer) {
        return res.status(404).json({ error: 'Transformer not found' });
      }

      res.json({
        name: transformer.name,
        state: transformer.getResonanceMetrics(),
        activeCapabilities: transformer.getActiveCapabilities()
      });
    });
  }

  _setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('🌐 Client connected');

      socket.on('processCommand', async (data) => {
        const { transformer, command } = data;
        const tf = this.transformers.get(transformer.toLowerCase());
        
        if (tf) {
          try {
            const response = await tf.processVoiceCommand(command);
            socket.emit('transformerResponse', response);
            
            // Broadcast state update
            this.io.emit('transformerState', {
              name: tf.name,
              state: tf.getResonanceMetrics()
            });
          } catch (error) {
            socket.emit('error', error.message);
          }
        } else {
          socket.emit('error', 'Transformer not found');
        }
      });

      socket.on('getTransformers', () => {
        const transformers = Array.from(this.transformers.values()).map(t => ({
          name: t.name,
          personality: t.personality,
          capabilities: t.capabilities
        }));
        socket.emit('transformersList', transformers);
      });

      socket.on('disconnect', () => {
        console.log('🌐 Client disconnected');
      });
    });
  }

  setTransformers(transformers) {
    this.transformers = transformers;
  }

  start(port = 3000) {
    if (!this.initialized) {
      this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        console.log(`🌐 Genesis Drive server running on port ${port}`);
        console.log(`📡 API available at http://localhost:${port}/api`);
        console.log(`🌐 Web interface at http://localhost:${port}`);
        resolve();
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`⚠️ Port ${port} is in use, attempting to use ${port + 1}`);
          this.start(port + 1).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
    });
  }
}

// Create singleton instance
const serverInstance = new Server();

// Export the instance and its methods
module.exports = {
  io: serverInstance.io,
  startServer: () => serverInstance.start(),
  getServer: () => serverInstance,
  setTransformers: (transformers) => serverInstance.setTransformers(transformers)
}; 