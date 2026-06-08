import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import db from './config/db.js';
import errorMiddleware from './middlewares/error.middleware.js';
import userRoutes from './modules/users/user.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/audit', auditRoutes);

app.get('/status', async (req, res, next) => {
  try {
    await db.query('SELECT 1');

    res.json({
      status: 'online',
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
});

app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/auth', authRoutes);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `A porta ${PORT} ja esta em uso. Feche o servidor antigo ou altere PORT no .env.`
    );
    process.exit(1);
  }

  throw error;
});
