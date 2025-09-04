import { Request, Response } from "express";
import usersModel from "../models/usersModel";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


async function addUser(req:Request, res:Response){
    const body = req.body;
    const user = await usersModel.addUser(body);
    const token = jwt.sign(user,process.env.JWT_SECRET);
    res.status(201);
    res.send({...user,token});
}

export default {addUser};