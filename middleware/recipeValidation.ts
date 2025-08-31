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
    const valid = validateRecipe(req.body);
    if(valid){
        next();
    } else {
        const error = new ValidationError(validateRecipe.errors[0].message);
        next(error);
    }
}