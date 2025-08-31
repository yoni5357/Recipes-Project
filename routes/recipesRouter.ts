import express from "express";
import recipesController from "../controllers/recipesController";
import {recipeValidation} from "../middleware/recipeValidation";

const router = express.Router();

router.get("/", recipesController.getRecipes);
router.post("/", recipeValidation, recipesController.addRecipe);

router.get("/stats", recipesController.getStats);

router.get("/:id", recipesController.getRecipeById);
router.put("/:id", recipeValidation, recipesController.updateRecipe);
router.delete("/:id", recipesController.deleteRecipe);


export default router;