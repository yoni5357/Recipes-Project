import express from "express";
import recipesController from "../controllers/recipesController";
import {recipeValidation} from "../middleware/recipeValidation";
import { authenticateToken } from "../middleware/authenticateUser";
import multer from "multer";

const upload = multer({
	dest: "public/",
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
		}
	}
});

const router = express.Router();

router.get("/", recipesController.getRecipes);
router.post("/", authenticateToken, upload.single("image"), recipeValidation, recipesController.addRecipe);

router.get("/stats", recipesController.getStats);

router.get("/:id", recipesController.getRecipeById);
router.put("/:id", recipeValidation, recipesController.updateRecipe);
router.delete("/:id", recipesController.deleteRecipe);


export default router;