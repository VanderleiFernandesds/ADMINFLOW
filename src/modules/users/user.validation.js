function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export function validateCreateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(createValidationError('Nome e e-mail sao obrigatorios'));
  }

  return next();
}

export function validateUpdateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(createValidationError('Nome e e-mail sao obrigatorios'));
  }

  return next();
}
