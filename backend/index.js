import express from "express";
import "dotenv/config";
import { databaseInit } from "./db/connectPostgres.js";
import publicRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/posts.js";
import notificationRouter from "./routes/notifications.js";
import cors from "cors";
import adRouter from "./routes/ads.js";

const app = express();
const PORT = process.env.PORT || 8585;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow only the frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // You can specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add other headers as needed
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

databaseInit();

app.use("/", publicRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/notifications", notificationRouter);
app.use("/ads", adRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
