import { findAuditLogs } from './audit.repository.js';

export async function getLogs(req, res) {
  const logs = await findAuditLogs();

  res.json(logs);
}
