import db from '../db.js';

export async function getUsers(req, res) {
  try {
    const [users] = await db.query(
      `SELECT

        id,
        name,
        email,
        status,
        created_at

      FROM users`
    );

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erro ao buscar usuários',
    });
  }
}


export async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email ) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios',
      });
    }

    const [result] = await db.query(
      `INSERT INTO users

      (
        name,
        email,
        password
      )

      VALUES (?, ?, ?)`,

      [name, email,'123456']
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

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const { name, email, status } = req.body;

    const [result] = await db.query(
      `UPDATE users

      SET

      name = ?,

      email = ?,

      status = ?

      WHERE id = ?`,

      [name, email, status, id]
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
    res.status(500).json({
      message: 'Erro ao atualizar usuário',
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',

      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      message: 'Usuário removido',
    });
  } catch {
    res.status(500).json({
      message: 'Erro ao remover usuário',
    });
  }
}
