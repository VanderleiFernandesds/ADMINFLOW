// Importar pool de conexão do banco
import db from '../db.js';

/**
 * GET /users
 * Retorna todos os usuários do banco de dados
 */
export async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const [[countResult]] = await db.query('SELECT COUNT(*) AS total FROM users');
    const totalPages = Math.max(Math.ceil(countResult.total / limit), 1);

    const [users] = await db.query(
      `SELECT
          id,
          name,
          email,
          status,
          role,
          created_at
        FROM users
         WHERE status = 'active'
        LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.status(200).json({
      users,
      totalPages,
    });
  } catch (error) {
    console.error(error);

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
    const { name, email, role = 'customer', status = 'active' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios',
      });
    }

    const [result] = await db.query(
      `INSERT INTO users
        (
          name,
          email,
          password,
          role,
          status
        )
        VALUES (?, ?, ?, ?, ?)`,
      [name, email, '123456', role, status]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

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
    const { id } = req.params;
    const { name, email, status, role = 'customer' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'Nome e e-mail são obrigatórios',
      });
    }

    const [result] = await db.query(
      `UPDATE users
        SET
          name = ?,
          email = ?,
          status = ?,
          role = ?
        WHERE id = ?`,
      [name, email, status, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      message: 'Usuário atualizado',
    });
  } catch (error) {
    console.error(error);

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
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE users
       SET status = 'inactive'
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      message: 'Usuário desativado com sucesso',
    });
  } catch {
    res.status(500).json({
      message: 'Erro ao desativar usuário',
    });
  }
}
