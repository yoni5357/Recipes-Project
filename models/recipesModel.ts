
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
  createdAt: "2025-01-01T00:00:00.000Z"
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
  createdAt: "2025-02-01T00:00:00.000Z"
}
]

type recipeBody = {
  id:string;
  title:string;
  description:string;
  ingredients:string[];
  instructions:string[];
  cookingTime:number;
  servings:number;
  difficulty:string;
  rating:number;
  createdAt:string;
}

export type filterObject = {
  difficulty:string|null|undefined;
  maxCookingTime:string|null|undefined;
  search:string|null|undefined;
}


function getRecipes(filters:filterObject){
  const filteredRecipes = recipes.filter((recipe) => {
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.maxCookingTime && recipe.cookingTime > parseInt(filters.maxCookingTime)) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!recipe.title.toLowerCase().includes(searchLower) && !recipe.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  })
  return filteredRecipes;
}

function getRecipeById(recipeId:string){
  const recipe = recipes.find(r => r.id === recipeId);
  return recipe;
}

function updateRecipe(recipeId:string, body:recipeBody){
  const recipe = getRecipeById(recipeId);
  recipe.title = body.title;
  recipe.description = body.description;
  recipe.difficulty = body.difficulty;
  recipe.cookingTime = body.cookingTime;
  recipe.createdAt = body.createdAt;
  recipe.ingredients = body.ingredients;
  recipe.instructions = body.instructions;
  recipe.rating = body.rating;
  recipe.servings = body.servings;
}

export default {getRecipes,getRecipeById,updateRecipe};