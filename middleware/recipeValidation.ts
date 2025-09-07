import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import recipeSchema from "../data/recipeSchema";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../errors";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajvErrors(ajv);
const validateRecipe = ajv.compile(recipeSchema);

export function recipeValidation(req:Request,res:Response,next:NextFunction){
    req.body.ingredients = JSON.parse(req.body.ingredients);
    req.body.instructions = JSON.parse(req.body.instructions);
    req.body.cookingTime = JSON.parse(req.body.cookingTime);
    req.body.servings = JSON.parse(req.body.servings);
    req.body.rating = JSON.parse(req.body.rating);
    req.body.isPublic = JSON.parse(req.body.isPublic);
    const valid = validateRecipe(req.body);
    if(valid){
        next();
    } else {
        const error = new ValidationError(validateRecipe.errors[0].message);
        next(error);
    }
}