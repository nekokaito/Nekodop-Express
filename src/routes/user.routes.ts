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
import { wrap } from "../utils/controllerWrapper";

const router = Router();

router.post("/register", wrap(registerUser));
router.post("/login", wrap(loginUser));
router.get("/get-user/:id", wrap(getUserById));
router.get("/get-users", wrap(getUsers));
router.put("/update-user/:user_id", wrap(updateUser));
router.put("/update-password/:user_id", wrap(updatePassword));
router.delete("/delete-user/:req_id/:user_id", wrap(deleteUser));
router.get("/is-admin/:id", wrap(isAdmin));

export default router;
