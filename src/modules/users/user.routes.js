import express from 'express';

import asyncHandler from '../../utils/asyncHandler.js';
import { createUser, deleteUser, getUsers, updateUser } from './user.controller.js';
import { validateCreateUser, validateUpdateUser } from './user.validation.js';

const router = express.Router();

router.get('/', asyncHandler(getUsers));
router.post('/', validateCreateUser, asyncHandler(createUser));
router.put('/:id', validateUpdateUser, asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;
