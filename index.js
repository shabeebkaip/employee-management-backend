import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./Routes/routes.js";
// import Admin from "./model/admin.js";
// import User from "./model/users.js";
// import bcrypt from "bcrypt";
// import Auth from "./model/auth.js";

const dotEnvConfig = dotenv.config({ path: ".env" });
const app = express();
const DB_URL = process.env.MONGO;
const port = process.env.PORT || 8000;

if (dotEnvConfig.error) {
  console.error("Error loading .env file", dotEnvConfig.error);
}
mongoose.connect(DB_URL).then(
  async () => {
    console.log(DB_URL);
    console.log("Database connected successfully");
  },
  (err) => {
    console.log(err);
    console.log("Unable to connect database");
  }
);

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(port, () => console.log(`Server connnected at ${port}`));
