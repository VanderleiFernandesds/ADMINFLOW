import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { findUserByEmail, createAuthUser } from './auth.repository.js';

import { validateRegisterData, validateLoginData } from './auth.validation.js';

export async function registerService(data) {
  validateRegisterData(data);

  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const id = await createAuthUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'customer',
  });

  return id;
}

export async function loginService(data) {
  validateLoginData(data);

  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  if (user.status !== 'active') {
    throw new Error('Usuário inativo');
  }

  const passwordIsValid = await bcrypt.compare(data.password, user.password);

  if (!passwordIsValid) {
    throw new Error('Email ou senha inválidos');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
