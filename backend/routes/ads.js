import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/upload.js";
import createAd from "../controllers/ads.controller/createAd.js";
import deletAd from "../controllers/ads.controller/deleteAd.js";
import getAllAds from "../controllers/ads.controller/getAllAds.js";

const adRouter = Router();

adRouter.use(isAuth);

adRouter.post("/create", upload.single("adImg"), createAd);
adRouter.delete("/:id", deletAd);
adRouter.get("/all", getAllAds);

export default adRouter;
