export function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role_id;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Acesso negado',
      });
    }

    next();
  };
}
