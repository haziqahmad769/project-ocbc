import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import createPost from "../controllers/post.controller/createPost.js";
import upload from "../middlewares/upload.js";
import deletePost from "../controllers/post.controller/deletePost.js";
import getAllPosts from "../controllers/post.controller/getAllPosts.js";
import getUserPosts from "../controllers/post.controller/getUserPosts.js";
import commentOnPost from "../controllers/post.controller/commentOnPost.js";
import likeUnlikePost from "../controllers/post.controller/likeUnlikePost.js";
import getLikedPosts from "../controllers/post.controller/getLikedPosts.js";

const postRouter = Router();

postRouter.use(isAuth);

postRouter.post("/create", upload.single("img"), createPost);
postRouter.delete("/:id", deletePost);
postRouter.get("/all", getAllPosts);
postRouter.get("/user/:username", getUserPosts);
postRouter.post("/:id/comment", commentOnPost);
postRouter.post("/:id/like", likeUnlikePost);
postRouter.get("/liked/:id", getLikedPosts);

export default postRouter;
