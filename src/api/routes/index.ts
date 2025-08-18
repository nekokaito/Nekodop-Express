import { Router } from "express";
import {
  createCat,
  deleteCat,
  getCatById,
  getCats,
  getCatsAdmin,
  getCatsByOwner,
  updateCat,
} from "../controller/cat.controller";

const router = Router();

// cats
router.post("/create-cat", createCat);
router.get("/get-cats", getCats);
router.get("/admin/get-cats", getCatsAdmin);
router.get("/get-cat/:id", getCatById);
router.get("/get-cats/:owner_id", getCatsByOwner);
router.put("/update-cat/:cat_id", updateCat);
router.delete("/delete-cat/:cat_id", deleteCat);
// ! user
// router.post("/register", registerUser)
// router.post("/login", loginUser)
// router.get("/get-user/:id", getUserById)
// router.get("/get-users", getUsers)
// router.put("/update-user/:user_id", updateUser)
// router.put("/update-password/:user_id", updatePassword)
// router.delete("/delete-user/:req_id/:user_id", deleteUser)
// router.get("/is-admin/:id", isAdmin)

export default router;
