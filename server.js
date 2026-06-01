// Importar express para criar a API
import express from 'express';

// Importar dotenv para carregar variáveis de ambiente
import dotenv from 'dotenv';

// Importar pool de conexão do banco de dados
import db from './db.js';

// Importar rotas de usuários
import userRoutes from './routes/userRoutes.js';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar instância do app Express
const app = express();

// Middleware para aceitar JSON no body das requisições
app.use(express.json());

// Variável para armazenar a rota base
const rota = '/users';

// Usar as rotas de usuários sob o prefixo '/users'
app.use(rota, userRoutes);

// Rota GET para verificar se a API está online
app.get('/', (req, res) => {
  res.json({
    message: 'AdminFlow API Online',
  });
});

// Rota GET para verificar status da conexão com o banco
app.get('/status', async (req, res) => {
  try {
    // Fazer uma query simples para testar a conexão
    await db.query('SELECT 1');

    res.json({
      status: 'online',
      database: 'connected',
    });
  } catch {
    // Se falhar, retornar erro
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// Iniciar o servidor na porta definida em .env
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
  console.log(`http://localhost:${process.env.PORT}${rota}`);
});
