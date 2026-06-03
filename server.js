import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import db from './db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({
    message: 'AdminFlow API Online',
  });
});

app.get('/status', async (req, res) => {
  try {
    await db.query('SELECT 1');

    res.json({
      status: 'online',
      database: 'connected',
    });
  } catch {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.use('/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
