import { authFetch } from '../utils/auth.js';

const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000/users' : '/users';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisicao');
  }

  return data;
}

export async function fetchUsers(page) {
  const response = await authFetch(`${API_URL}?page=${page}`);

  return parseResponse(response);
}

export async function createUser(user) {
  const response = await authFetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return parseResponse(response);
}

export async function updateUser(id, user) {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return parseResponse(response);
}

export async function deleteUser(id) {
  const response = await authFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  return parseResponse(response);
}
