import { Router } from "express";
import {
  createCat,
  getCats,
  getCatsAdmin,
  getCatById,
  getCatsByOwner,
  updateCat,
  deleteCat,
} from "../controllers/cat.controller";

const router = Router();

router.post("/create-cat", createCat);
router.get("/get-cats", getCats);
router.get("/admin/get-cats", getCatsAdmin);
router.get("/get-cat/:id", getCatById);
router.get("/get-cats/:owner_id", getCatsByOwner);
router.put("/update-cat/:cat_id", updateCat);
router.delete("/delete-cat/:cat_id", deleteCat);

export default router;
