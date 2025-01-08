import express from "express";
import { getHealth } from "./controllers/health.controller.js"
import { postHealth } from "./controllers/health.controller.js";
import { databaseInit } from "./db/connectPostgres.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

databaseInit()

app.get("/", getHealth);
app.post("/", postHealth);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
