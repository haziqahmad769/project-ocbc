import express from "express";
import "dotenv/config";
import { databaseInit } from "./db/connectPostgres.js";
import publicRouter from "./routes/index.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

databaseInit();

app.use("/", publicRouter);
app.use("/users", userRouter);
// app.use("/posts");
// app.use("/notifications");

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
