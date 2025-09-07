import { NextFunction, Request, Response } from "express";
import recipesModel from "../models/recipesModel";


export async function checkRecipeOwnership(req:Request, res:Response, next:NextFunction){
    const recipeId = req.params.id;
    const userId = req.user;
    const isAuthorized = recipesModel.checkAuth(recipeId,userId);
    if(!isAuthorized){
        throw new Error("user not authorized");
    }
    else{
        next();
    }
}