import { Router } from "express";
import getUserProfile from "../controllers/user.controller/getUserProfile.js";
import isAuth from "../middlewares/isAuth.js";
import updateUser from "../controllers/user.controller/updateUser.js";
import upload from "../middlewares/upload.js";

const userRouter = Router();

userRouter.use(isAuth);

userRouter.get("/:username", getUserProfile);
userRouter.put("/update", upload.fields([{ name: "profileImg" }]), updateUser);

export default userRouter;
