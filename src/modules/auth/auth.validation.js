export function validateRegisterData(data) {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error('Nome, email e senha são obrigatórios');
  }

  if (password.length < 6) {
    throw new Error('A senha precisa ter pelo menos 6 caracteres');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
}

export function validateLoginData(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }
}
