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
