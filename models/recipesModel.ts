import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { sequelize } from "../connections";
import fs from "fs";
import dotenv from "dotenv";
import { NotFoundError } from "../errors";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const recipes = [
  {
    id: "unique-id",
    title: "Recipe Title",
    description: "Brief description",
    ingredients: ["ingredient 1", "ingredient 2"],
    instructions: ["step 1", "step 2"],
    cookingTime: 30, // in minutes
    servings: 4,
    difficulty: "easy", // easy, medium, hard
    rating: 4.5,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "unique-id-2",
    title: "Another Recipe",
    description: "Another brief description",
    ingredients: ["ingredient A", "ingredient B"],
    instructions: ["step A", "step B"],
    cookingTime: 45, // in minutes
    servings: 2,
    difficulty: "medium", // easy, medium, hard
    rating: 4.0,
    createdAt: "2025-02-01T00:00:00.000Z",
  },
];

type recipeBody = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: string;
  rating: number;
  isPublic: boolean;
  imageUrl: string;
  createdAt: string;
  userId?: string;
};

export type filterObject = {
  difficulty: string | null | undefined;
  maxCookingTime: string | null | undefined;
  search: string | null | undefined;
};

function getRecipes(filters: filterObject) {
  const filteredRecipes = recipes.filter((recipe) => {
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    if (
      filters.maxCookingTime &&
      recipe.cookingTime > parseInt(filters.maxCookingTime)
    ) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !recipe.title.toLowerCase().includes(searchLower) &&
        !recipe.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });
  return filteredRecipes;
}

async function getRecipeById(recipeId: string) {
  const [results] = await sequelize.query(
    `SELECT * FROM recipes
    WHERE id = :id`,
    {
      replacements: { id: recipeId },
    }
  );
  if(!results[0]){
    throw new NotFoundError("Recipe does not exist");
  }
  return results[0] as recipeBody;
}

async function checkAuth(recipeId: string, userId: string) {
  const recipe = await getRecipeById(recipeId);
  console.log("userId: ",userId)
  console.log("recipe.userId: ",recipe.userId)
  if (userId === recipe.userId) {
    return true;
  }
  return false;
}

async function updateRecipe(recipeId: string, body: recipeBody, file: any) {
  let imageUrl = body.imageUrl;
  try {
    // If a new file is provided, upload to Cloudinary
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      imageUrl = uploadResult ? uploadResult.url : body.imageUrl;
    }
    const updateFields = {
      title: body.title,
      description: body.description,
      difficulty: body.difficulty,
      cookingTime: body.cookingTime,
      ingredients: JSON.stringify(body.ingredients),
      instructions: JSON.stringify(body.instructions),
      rating: body.rating,
      servings: body.servings,
      isPublic: body.isPublic,
      imageUrl: imageUrl,
    };
    const [result] = await sequelize.query(
      `UPDATE recipes SET
        title = :title,
        description = :description,
        difficulty = :difficulty,
        cookingTime = :cookingTime,
        ingredients = :ingredients,
        instructions = :instructions,
        rating = :rating,
        servings = :servings,
        isPublic = :isPublic,
        imageUrl = :imageUrl
      WHERE id = :id`,
      { replacements: { ...updateFields, id: recipeId } }
    );
    return await getRecipeById(recipeId);
  } catch (err) {
    console.error(err);
    return;
  } finally {
    file && fs.promises.unlink(file.path);
  }
}

async function addRecipe(body: recipeBody, userId: string, file: any) {
  try {
    const recipeId = uuidv4();
    let uploadResult = null;
    if (file) {
      uploadResult = await cloudinary.uploader.upload(file.path);
    }
    const newRecipe = {
      id: recipeId,
      ...body,
      userId,
      ingredients: JSON.stringify(body.ingredients),
      instructions: JSON.stringify(body.instructions),
      imageUrl: uploadResult ? uploadResult.url : null,
    };
    await sequelize.query(
      `INSERT INTO recipes (
      id,
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      imageUrl,
      isPublic,
      rating,
      userId
      )
      VALUES (
      :id,
      :title,
      :description,
      :ingredients,
      :instructions,
      :cookingTime,
      :servings,
      :difficulty,
      :imageUrl,
      :isPublic,
      :rating,
      :userId
      )`,
      { replacements: { ...newRecipe } }
    );
    return newRecipe;
  } finally {
    file && fs.promises.unlink(file.path);
  }
}

async function deleteRecipe(recipeId: string) {
  // Get the recipe to find the imageUrl (if any)
  const recipe = await getRecipeById(recipeId);
  // If there is an imageUrl, attempt to delete from Cloudinary
  if (recipe.imageUrl) {
    // Extract public_id from the imageUrl
    // Cloudinary URLs are typically: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
    const urlParts = recipe.imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicIdWithExt = fileName.split('.')[0];
    // If your uploads are in a folder, you may need to include the folder in public_id
    // For more robust extraction, remove everything before '/upload/'
    let publicId = publicIdWithExt;
    console.log(publicId);
    await cloudinary.uploader.destroy(publicId);
  }
  const [result]: any = await sequelize.query(
    `DELETE FROM recipes WHERE id = :recipeId`,
    { replacements: { recipeId } }
  );
  // For MySQL, result.affectedRows; for SQLite, result.changes
  if (result.affectedRows === 0) {
    return false;
  }
  return true;
}

function getStats() {
  const totalRecipes = recipes.length;
  const averageCookingTime = getAvereageCookingTime();
  const recipesByDifficulty = getRecipesByDifficulty();
  return {
    totalRecipes: totalRecipes,
    averageCookingTime: averageCookingTime,
    recipesByDifficulty: recipesByDifficulty,
  };
}

function getAvereageCookingTime() {
  const avg =
    recipes.reduce((acc, recipe) => acc + recipe.cookingTime, 0) /
    recipes.length;
  return avg;
}
function getRecipesByDifficulty() {
  const difficultyCount: { [key: string]: number } = {};
  recipes.forEach((recipe) => {
    if (difficultyCount[recipe.difficulty]) {
      difficultyCount[recipe.difficulty]++;
    } else {
      difficultyCount[recipe.difficulty] = 1;
    }
  });
  return difficultyCount;
}

export default {
  getRecipes,
  getRecipeById,
  updateRecipe,
  addRecipe,
  deleteRecipe,
  getStats,
  checkAuth,
};
