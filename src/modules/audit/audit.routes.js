import express from 'express';

import { getLogs } from './audit.controller.js';

import { authMiddleware } from '../../middlewares/auth.middleware.js';

import { roleMiddleware } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get(
  '/',

  authMiddleware,

  roleMiddleware([1]),

  getLogs
);

export default router;
