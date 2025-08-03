import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  isAdmin,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:user_id", updateUser);
router.delete("/delete/:user_id", deleteUser);
router.get("/is-admin/:id", isAdmin);

export default router;
