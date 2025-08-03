import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  getUsers,
  updateUser,
  updatePassword,
  deleteUser,
  isAdmin,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user/:id", getUserById);
router.get("/get-users", getUsers);
router.put("/update-user/:user_id", updateUser);
router.put("/update-password/:user_id", updatePassword);
router.delete("/delete-user/:req_id/:user_id", deleteUser);
router.get("/is-admin/:id", isAdmin);

export default router;
