// Importar pool de conexão do banco
import db from '../db.js';

/**
 * GET /users
 * Retorna todos os usuários do banco de dados
 */
export async function getUsers(req, res) {
  try {
    // Executar query para buscar todos os usuários
    const [users] = await db.query(`SELECT

        id,
        name,
        email,
        status,
        created_at

      FROM users`);

    // Retornar usuários com status 200 (OK)
    res.status(200).json(users);
  } catch (error) {
    // Log do erro no console
    console.error(error);

    // Retornar erro 500 (erro do servidor)
    res.status(500).json({
      message: 'Erro ao buscar usuários',
    });
  }
}

/**
 * POST /users
 * Cria um novo usuário
 * Requer: name, email
 */
export async function createUser(req, res) {
  try {
    // Extrair dados do body da requisição
    const { name, email } = req.body;

    // Validar se os campos obrigatórios foram preenchidos
    if (!name || !email) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios',
      });
    }

    // Inserir novo usuário no banco
    const [result] = await db.query(
      `INSERT INTO users

      (
        name,
        email,
        password
      )

      VALUES (?, ?, ?)`,

      [name, email, '123456']
    );

    // Retornar sucesso 201 (criado) com ID do novo usuário
    res.status(201).json({
      message: 'Usuário criado com sucesso',

      id: result.insertId,
    });
  } catch (error) {
    // Log do erro
    console.error(error);

    // Retornar erro 500
    res.status(500).json({
      message: 'Erro ao criar usuário',
    });
  }
}

/**
 * PUT /users/:id
 * Atualiza um usuário específico
 * Requer: id (via URL), name, email, status (via body)
 */
export async function updateUser(req, res) {
  try {
    // Extrair ID da URL
    const { id } = req.params;

    // Extrair dados de atualização do body
    const { name, email, status } = req.body;

    // Atualizar usuário no banco
    const [result] = await db.query(
      `UPDATE users

      SET

      name = ?,

      email = ?,

      status = ?

      WHERE id = ?`,

      [name, email, status, id]
    );

    // Verificar se alguma linha foi afetada (usuário existe)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    // Retornar sucesso
    res.json({
      message: 'Usuário atualizado',
    });
  } catch (error) {
    // Retornar erro 500
    res.status(500).json({
      message: 'Erro ao atualizar usuário',
    });
  }
}

/**
 * DELETE /users/:id
 * Deleta um usuário específico
 * Requer: id (via URL)
 */
export async function deleteUser(req, res) {
  try {
    // Extrair ID da URL
    const { id } = req.params;

    // Deletar usuário do banco
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    // Verificar se alguma linha foi afetada (usuário existe)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    // Retornar sucesso
    res.json({
      message: 'Usuário removido',
    });
  } catch {
    // Retornar erro 500
    res.status(500).json({
      message: 'Erro ao remover usuário',
    });
  }
}
