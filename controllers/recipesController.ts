import { Request, Response } from "express";
import recipesModel, { filterObject } from "../models/recipesModel";


function getRecipes(req:Request,res:Response){
    const filters = req.query
    res.status(200);
    res.send(recipesModel.getRecipes(filters as filterObject));
}

function getRecipeById(req:Request,res:Response){
    const recipe = recipesModel.getRecipeById(req.params.id);
    if(!recipe){
        res.status(404);
        res.send("Recipe not found");
    } else {
        res.status(200);
        res.send(recipe);
    }
}

function updateRecipe(req:Request,res:Response){
    const recipeId = req.params.id;
    const updatedRecipe = req.body;
    if(!recipesModel.updateRecipe(recipeId,updatedRecipe)){
        res.sendStatus(404);
    } else {
        res.status(201);
        res.send(recipesModel.getRecipeById(recipeId));
    }
}

function addRecipe(req:Request, res:Response){
    const body = req.body;
    res.status(201);
    res.send(recipesModel.addRecipe(body));
}

function deleteRecipe(req:Request, res:Response){
    const recipeId = req.params.id;
    if(!recipesModel.deleteRecipe(recipeId)){
        res.status(404);
    } else {
        res.sendStatus(204);
    }
}

function getStats(req:Request, res:Response){
    res.status(200);
    res.send(recipesModel.getStats());
}

export default {getRecipes, getRecipeById, updateRecipe, addRecipe, deleteRecipe, getStats};