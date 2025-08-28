import express from "express";
import recipesController from "../controllers/recipesController";

const router = express.Router();

router.get("/",recipesController.getRecipes);
router.get("/:id", recipesController.getRecipeById);
router.put("/:id", recipesController.updateRecipe);

export default router;