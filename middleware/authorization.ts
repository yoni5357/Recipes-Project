import { NextFunction, Request, Response } from "express";

import recipesModel from "../models/recipesModel";
import { AuthorizationError } from "../errors";


export async function checkRecipeOwnership(req: Request, res: Response, next: NextFunction) {
    const recipeId = req.params.id;
    const userId = req.user;
    try {
        const isAuthorized = await recipesModel.checkAuth(recipeId, userId);
        if (!isAuthorized) {
            return next(new AuthorizationError());
        }
        next();
    } catch (err) {
        next(err); // Forward NotFoundError or any other error
    }
}