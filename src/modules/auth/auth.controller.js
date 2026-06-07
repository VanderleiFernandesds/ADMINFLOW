import { registerService, loginService } from './auth.service.js';

export async function register(req, res) {
  try {
    const id = await registerService(req.body);

    res.status(201).json({
      message: 'Conta criada com sucesso',
      id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const data = await loginService(req.body);

    res.json(data);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
}
