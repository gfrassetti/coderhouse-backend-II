import { Router } from "express";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  getRouter() {
    return this.router;
  }
  init() {}

  /* cb = [] */
  get(path, policies, ...cb) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.customResponse,
      this.applyCallbacks(cb)
    );
  }

  post(path, policies, ...cb) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.customResponse,
      this.applyCallbacks(cb)
    );
  }
  applyCallbacks(cb) {
    console.log("Callbacks:", cb);
    return cb.map((callback) => async (...params) => {
      console.log("Params:", params);
      console.log("cb:", callback);
      try {
        await callback.apply(this, params); //apply method, pasa el array
      } catch (error) {
        return params[1].status(500).send(error); //params en ubicacion 1 es res
      }
    });
  }

  customResponse(req, res, next) {
    res.success = (payload) => res.json({ status: "success", payload });
    res.errorServer = (error) =>
      res.status(500).json({ status: "error", error });
    res.notFound = () =>
      res.status(404).json({ status: "error", error: "Not found" });
    next();
  }

  handlePolicies(policies) {
    return (req, res, next) => {
      //["PUBLIC", "USER", "ADMIN"]
      if (policies.includes("PUBLIC")) return next();
      const reqJwt = req.headers.authorization;
      if (!reqJwt)
        return res
          .status(401)
          .json({ status: "error", message: "Not logged in" });
      const payload = jwt.verify(reqJwt, process.env.JWT_SECRET);
      if (!payload)
        return res
          .status(401)
          .json({ status: "error", message: "Invalid token" });
      if (policies.includes(payload.role.toUpperCase()))
        return res
          .status(403)
          .json({ status: "error", message: "Not authorized" });
      req.user = payload;
      next();
    };
  }
}
