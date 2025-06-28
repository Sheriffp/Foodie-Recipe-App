import express from "express";
import { addFood, getFood, deleteFood, getFoodById } from "../controllers/foodController.js";

const router = express.Router();

router.delete("/:recipeId", deleteFood);
router.post("/", addFood);
router.get("/", getFood);
router.get("/:recipeId", getFoodById);

export default router;
