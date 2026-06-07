import db from '../../config/db.js';

export async function findUserByEmail(email) {
  const [users] = await db.query(
    `SELECT id, name, email, password, role, status
     FROM users
     WHERE email = ?`,
    [email]
  );

  return users[0];
}

export async function createAuthUser(data) {
  const { name, email, password, role } = data;

  const [result] = await db.query(
    `INSERT INTO users
     (name, email, password, role, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, role, 'active']
  );

  return result.insertId;
}
