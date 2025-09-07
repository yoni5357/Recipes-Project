import express from "express";
import recipesController from "../controllers/recipesController";
import { recipeValidation } from "../middleware/recipeValidation";
import { authenticateToken } from "../middleware/authenticateUser";
import { upload } from "../middleware/fileUpload";
import {checkRecipeOwnership} from "../middleware/authorization";

const router = express.Router();

router.get("/", recipesController.getRecipes);
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  recipeValidation,
  recipesController.addRecipe
);

router.get("/stats", recipesController.getStats);

router.get("/:id", recipesController.getRecipeById);
router.put(
  "/:id",
  authenticateToken,
  checkRecipeOwnership,
  upload.single("image"),
  recipeValidation,
  recipesController.updateRecipe
);
router.delete("/:id", recipesController.deleteRecipe);

export default router;
