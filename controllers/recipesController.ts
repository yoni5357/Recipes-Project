import { Request, Response, NextFunction } from "express";
import recipesModel, { filterObject } from "../models/recipesModel";
import { NotFoundError } from "../errors";


function getRecipes(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;
        res.status(200);
        res.send(recipesModel.getRecipes(filters as filterObject));
    } catch (err) {
        next(err);
    }
}

async function getRecipeById(req: Request, res: Response, next: NextFunction) {
    try {
        const recipe = await recipesModel.getRecipeById(req.params.id);
        if (!recipe) {
            res.status(404);
            res.send("Recipe not found");
        } else {
            res.status(200);
            res.send(recipe);
        }
    } catch (err) {
        next(err);
    }
}

async function updateRecipe(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.id;
    const updatedRecipe = req.body;
    const file = req.file;
    try {
        const newRecipe = await recipesModel.updateRecipe(recipeId, updatedRecipe, file);
        if (!newRecipe) {
            res.sendStatus(404);
        } else {
            res.status(201);
            res.send(newRecipe);
        }
    } catch (err) {
        next(err);
    }
}

async function addRecipe(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const userId = req.user.id;
    const file = req.file;
    try {
        const result = await recipesModel.addRecipe(body, userId, file);
        res.status(201);
        res.send(result);
    } catch (err) {
        next(err);
    }
}

async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.id;
    try {
        const deleted = await recipesModel.deleteRecipe(recipeId);
        if (!deleted) {
            throw new NotFoundError("Recipe not found");
        }
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

function getStats(req:Request, res:Response){
    res.status(200);
    res.send(recipesModel.getStats());
}

export default {getRecipes, getRecipeById, updateRecipe, addRecipe, deleteRecipe, getStats};