import {
  countAllUsers,
  countActiveUsers,
  countInactiveUsers,
  findRecentUsers,
} from './dashboard.repository.js';

export async function getDashboardStatsService() {
  const totalUsers = await countAllUsers();
  const activeUsers = await countActiveUsers();
  const inactiveUsers = await countInactiveUsers();
  const recentUsers = await findRecentUsers();

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    recentUsers,
  };
}
