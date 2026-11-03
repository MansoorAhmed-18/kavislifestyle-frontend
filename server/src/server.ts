import { app } from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✨ Kavi's Lifestyle API Server running on port ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Mode: ${env.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
