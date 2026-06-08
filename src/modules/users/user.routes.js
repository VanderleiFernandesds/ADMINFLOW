import express from 'express';

import asyncHandler from '../../utils/asyncHandler.js';
import { createUser, deleteUser, getUsers, updateUser } from './user.controller.js';
import { validateCreateUser, validateUpdateUser } from './user.validation.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
