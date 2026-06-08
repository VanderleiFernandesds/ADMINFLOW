import db from '../../config/db.js';

export async function createAuditLog(data) {
  const {
    user_id,

    action,

    entity,

    entity_id,
  } = data;

  await db.query(
    `INSERT INTO audit_logs (

      user_id,

      action,

      entity,

      entity_id

    )

    VALUES (?, ?, ?, ?)`,

    [user_id, action, entity, entity_id]
  );
}

export async function findAuditLogs() {
  const [logs] = await db.query(
    `SELECT

      a.id,

      a.action,

      a.entity,

      a.entity_id,

      a.created_at,

      u.name AS user_name

     FROM audit_logs a

     JOIN users u

       ON a.user_id = u.id

     ORDER BY a.created_at DESC

     LIMIT 100`
  );

  return logs;
}
