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

export default {getRecipes, getRecipeById};