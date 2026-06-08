import { createAuditLog } from './audit.repository.js';

export async function registerLog(data) {
  await createAuditLog(data);
}
