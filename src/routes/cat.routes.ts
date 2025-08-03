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
import { wrap } from "../utils/controllerWrapper";

const router = Router();

router.post("/create-cat", wrap(createCat));
router.get("/get-cats", wrap(getCats));
router.get("/admin/get-cats", wrap(getCatsAdmin));
router.get("/get-cat/:id", wrap(getCatById));
router.get("/get-cats/:owner_id", wrap(getCatsByOwner));
router.put("/update-cat/:cat_id", wrap(updateCat));
router.delete("/delete-cat/:cat_id", wrap(deleteCat));

export default router;
