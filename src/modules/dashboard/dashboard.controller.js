import { getDashboardStatsService } from './dashboard.service.js';

export async function getDashboardStats(req, res) {
  try {
    const stats = await getDashboardStatsService();

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao carregar estatísticas',
    });
  }
}
