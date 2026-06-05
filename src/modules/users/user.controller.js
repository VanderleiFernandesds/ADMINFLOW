import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from './user.service.js';

export async function getUsers(req, res) {
  const data = await getUsersService(req.query.page);

  return res.json(data);
}

export async function createUser(req, res) {
  const id = await createUserService(req.body);

  return res.status(201).json({
    id,
    message: 'Usuario criado',
  });
}

export async function updateUser(req, res) {
  await updateUserService(req.params.id, req.body);

  return res.json({
    message: 'Usuario atualizado',
  });
}

export async function deleteUser(req, res) {
  await deleteUserService(req.params.id);

  return res.json({
    message: 'Usuario desativado com sucesso',
  });
}
