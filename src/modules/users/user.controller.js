import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from './user.service.js';
import { registerLog } from '../audit/audit.service.js';

export async function getUsers(req, res) {
  const data = await getUsersService(req.query.page);

  return res.json(data);
}

export async function createUser(req, res) {
  const id = await createUserService(req.body);
  await registerLog({
    user_id: req.user.id,

    action: 'CREATE_USER',

    entity: 'users',

    entity_id: id,
  });
  return res.status(201).json({
    id,
    message: 'Usuario criado',
  });
}

export async function updateUser(req, res) {
  await updateUserService(req.params.id, req.body);
  await registerLog({
    user_id: req.user.id,

    action: 'UPDATE_USER',

    entity: 'users',

    entity_id: Number(req.params.id),
  });
  return res.json({
    message: 'Usuario atualizado',
  });
}

export async function deleteUser(req, res) {
  await deleteUserService(req.params.id);
  await registerLog({
    user_id: req.user.id,

    action: 'DELETE_USER',

    entity: 'users',

    entity_id: Number(req.params.id),
  });
  return res.json({
    message: 'Usuario desativado com sucesso',
  });
}
