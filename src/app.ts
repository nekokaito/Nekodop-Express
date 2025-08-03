import express from "express";
import userRoutes from "./routes/user.routes";
import catRoutes from "./routes/cat.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRoutes);
app.use("/cat", catRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
