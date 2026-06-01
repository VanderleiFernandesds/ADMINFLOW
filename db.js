// Importar mysql2/promise para usar promises com MySQL
import mysql from 'mysql2/promise';

// Importar dotenv para variáveis de ambiente
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Criar pool de conexões com o banco de dados
// Pool permite múltiplas conexões reutilizáveis
const pool = mysql.createPool({
  // Host do banco (ex: localhost)
  host: process.env.DB_HOST,

  // Usuário do banco
  user: process.env.DB_USER,

  // Senha do banco
  password: process.env.DB_PASSWORD,

  // Nome do banco de dados
  database: process.env.DB_NAME,

  // Aguardar por conexão disponível
  waitForConnections: true,

  // Máximo de conexões simultâneas
  connectionLimit: 10,

  // Máximo de requisições na fila
  queueLimit: 0,
});

// Exportar pool para usar em outros arquivos
export default pool;
