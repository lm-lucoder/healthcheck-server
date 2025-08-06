const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'Servidor de Healthcheck funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint de healthcheck
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      hostname: os.hostname(),
      loadAverage: os.loadavg()
    },
    environment: process.env.NODE_ENV || 'development'
  };

  res.status(200).json(healthData);
});

// Endpoint para informações detalhadas do sistema
app.get('/system', (req, res) => {
  const systemInfo = {
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024),
    cpus: os.cpus().map(cpu => ({
      model: cpu.model,
      speed: cpu.speed
    })),
    networkInterfaces: os.networkInterfaces(),
    loadAverage: os.loadavg()
  };

  res.json(systemInfo);
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    availableRoutes: ['/', '/health', '/system']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Healthcheck disponível em: http://localhost:${PORT}/health`);
  console.log(`💻 Info do sistema em: http://localhost:${PORT}/system`);
  console.log(`🏠 Página inicial em: http://localhost:${PORT}/`);
}); 