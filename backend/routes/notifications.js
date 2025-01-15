import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import getNotifications from "../controllers/notification.controller/getNotifications.js";
import deleteNotifications from "../controllers/notification.controller/deleteNotifications.js";

const notificationRouter = Router();

notificationRouter.use(isAuth);

notificationRouter.get("/", getNotifications);
notificationRouter.delete("/", deleteNotifications);

export default notificationRouter;
