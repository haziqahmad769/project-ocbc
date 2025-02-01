import { Router } from "express";
import getUserProfile from "../controllers/user.controller/getUserProfile.js";
import isAuth from "../middlewares/isAuth.js";
import updateUser from "../controllers/user.controller/updateUser.js";
import upload from "../middlewares/upload.js";
import followUnfollowUser from "../controllers/user.controller/followUnfollowUser.js";
import getAllUsers from "../controllers/user.controller/getAllUsers.js";

const userRouter = Router();

userRouter.use(isAuth);

userRouter.get("/all", getAllUsers);
userRouter.get("/:username", getUserProfile);
userRouter.put("/update", upload.fields([{ name: "profileImg" }]), updateUser);
userRouter.post("/:id/follow", followUnfollowUser);


export default userRouter;
