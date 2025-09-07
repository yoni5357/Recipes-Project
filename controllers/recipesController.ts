import { Request, Response } from "express";
import recipesModel, { filterObject } from "../models/recipesModel";


function getRecipes(req:Request,res:Response){
    const filters = req.query
    res.status(200);
    res.send(recipesModel.getRecipes(filters as filterObject));
}

async function getRecipeById(req:Request,res:Response){
    const recipe = await recipesModel.getRecipeById(req.params.id);
    if(!recipe){
        res.status(404);
        res.send("Recipe not found");
    } else {
        res.status(200);
        res.send(recipe);
    }
}

async function updateRecipe(req:Request,res:Response){
    const recipeId = req.params.id;
    const updatedRecipe = req.body;
    const file = req.file;
    try{
        const newRecipe = await recipesModel.updateRecipe(recipeId,updatedRecipe,file);
        if(!newRecipe){
            res.sendStatus(404);
        } else {
            res.status(201);
            res.send(newRecipe);
        }
    }catch(err){
        console.error("Error updating recipe: ",err);
    }
}

async function addRecipe(req:Request, res:Response){
    const body = req.body;
    const userId = req.user.id;
    const file = req.file;
    let result;
    try{
        result = await recipesModel.addRecipe(body,userId,file);
    } catch(err){
        console.error("Error inserting new recipe to db:", err);
        res.status(500).send("error inserting new recipe to db");
        return;
    }
    res.status(201);
    res.send(result);
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