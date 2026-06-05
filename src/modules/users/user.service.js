import {
  countUsers,
  createUser,
  deactivateUserById,
  findAllUsers,
  updateUserById,
} from './user.repository.js';

const USERS_PER_PAGE = 10;

function createNotFoundError(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

export async function getUsersService(page = 1) {
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * USERS_PER_PAGE;

  const users = await findAllUsers(USERS_PER_PAGE, offset);
  const total = await countUsers();

  return {
    users,
    total,
    totalPages: Math.ceil(total / USERS_PER_PAGE) || 1,
    page: safePage,
  };
}

export async function createUserService(data) {
  return createUser(data);
}

export async function updateUserService(id, data) {
  const affectedRows = await updateUserById(id, data);

  if (affectedRows === 0) {
    throw createNotFoundError('Usuario nao encontrado');
  }
}

export async function deleteUserService(id) {
  const affectedRows = await deactivateUserById(id);

  if (affectedRows === 0) {
    throw createNotFoundError('Usuario nao encontrado');
  }
}
