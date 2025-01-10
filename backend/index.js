import express from "express";
import { getHealth } from "./controllers/health.controller.js";
import { postHealth } from "./controllers/health.controller.js";
import { databaseInit } from "./db/connectPostgres.js";
import uploadFile from "./controllers/upload.controller/uploadFile.js";
import upload from "./middlewares/upload.js";
import listAllFiles from "./controllers/upload.controller/listAllFiles.js";
import register from "./controllers/auth.controller/register.js";
import login from "./controllers/auth.controller/login.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

databaseInit();

app.get("/", getHealth);
app.post("/", postHealth);

app.get("/upload", listAllFiles);
app.post("/upload", upload.single("image"), uploadFile);

app.post("/register", register);
app.post("/login", login);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
