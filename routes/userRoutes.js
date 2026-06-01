// Importar express para criar rotas
import express from 'express';

// Importar funções do controller de usuários
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

// Criar um roteador Express
const router = express.Router();

// GET /users - Listar todos os usuários
router.get('/', getUsers);

// POST /users - Criar um novo usuário
router.post('/', createUser);

// PUT /users/:id - Atualizar um usuário específico
router.put('/:id', updateUser);

// DELETE /users/:id - Deletar um usuário específico
router.delete('/:id', deleteUser);

// Exportar rotas para usar em server.js
export default router;
