import { Router } from "express";
import { getHealth, postHealth } from "../controllers/health.controller.js";
import signup from "../controllers/auth.controller/signup.js";
import { login, logout } from "../controllers/auth.controller/login.js";
import isAuth from "../middlewares/isAuth.js";
import getMe from "../controllers/auth.controller/getMe.js";

const publicRouter = Router();

publicRouter.get("/", getHealth);
publicRouter.post("/", postHealth);

publicRouter.post("/signup", signup);
publicRouter.post("/login", login);
publicRouter.post("/logout", logout);
publicRouter.get("/me", isAuth, getMe);

export default publicRouter;
