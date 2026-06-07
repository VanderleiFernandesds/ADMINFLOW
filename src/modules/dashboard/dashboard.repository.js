import db from '../../config/db.js';

export async function countAllUsers() {
  const [[result]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM users`
  );

  return result.total;
}

export async function countActiveUsers() {
  const [[result]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE status = 'active'`
  );

  return result.total;
}

export async function countInactiveUsers() {
  const [[result]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE status = 'inactive'`
  );

  return result.total;
}

export async function findRecentUsers() {
  const [users] = await db.query(
    `SELECT id, name, email, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT 5`
  );

  return users;
}
