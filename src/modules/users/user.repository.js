import db from '../../config/db.js';

export async function findAllUsers(limit, offset) {
  const [users] = await db.query(
    `SELECT
      id,
      name,
      email,
      role,
      status,
      created_at
    FROM users
    WHERE status = 'active'
    LIMIT ?
    OFFSET ?`,
    [limit, offset]
  );

  return users;
}

export async function countUsers() {
  const [[result]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE status = 'active'`
  );

  return result.total;
}

export async function createUser(data) {
  const { name, email, role = 'customer', status = 'active' } = data;

  const [result] = await db.query(
    `INSERT INTO users (
      name,
      email,
      role,
      status,
      password
    )
    VALUES (?, ?, ?, ?, ?)`,
    [name, email, role, status, '123456']
  );

  return result.insertId;
}

export async function updateUserById(id, data) {
  const { name, email, role = 'customer', status = 'active' } = data;

  const [result] = await db.query(
    `UPDATE users
     SET
      name = ?,
      email = ?,
      role = ?,
      status = ?
     WHERE id = ?`,
    [name, email, role, status, id]
  );

  return result.affectedRows;
}

export async function deactivateUserById(id) {
  const [result] = await db.query(
    `UPDATE users
     SET status = 'inactive'
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
}
