import { Router } from "express";
import {
  createCat,
  getCats,
  getCatById,
  updateCat,
  deleteCat,
} from "../controllers/cat.controller";

const router = Router();

router.post("/create", createCat);
router.get("/", getCats);
router.get("/:id", getCatById);
router.put("/update/:cat_id", updateCat);
router.delete("/delete/:cat_id", deleteCat);

export default router;
