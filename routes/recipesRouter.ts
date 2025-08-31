import express from "express";
import recipesController from "../controllers/recipesController";

const router = express.Router();

router.get("/",recipesController.getRecipes);
router.post("/", recipesController.addRecipe);

router.get("/stats", recipesController.getStats);

router.get("/:id", recipesController.getRecipeById);
router.put("/:id", recipesController.updateRecipe);
router.delete("/:id", recipesController.deleteRecipe);


export default router;