export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({
        status: "error",
        message: "Usuario no autenticado",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permiso para realizar esta acción",
      });
    }

    next();
  };
};

export const requireAdmin = authorize("admin");
export const requireUser = authorize("user", "admin");

