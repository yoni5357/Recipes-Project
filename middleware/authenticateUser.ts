import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
dotenv.config();

const secretKey = process.env.JWT_SECRET;



export function authenticateToken(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.sendStatus(401);
    }

    jwt.verify(token,secretKey,(err,user) => {
        if(err){
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    })
}
