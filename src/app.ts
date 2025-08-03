import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import catRoutes from "./routes/cat.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to Nekodop API!");
});
app.use("/", userRoutes);
app.use("/", catRoutes);
