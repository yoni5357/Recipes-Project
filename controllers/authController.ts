import { Request, Response } from "express";
import usersModel from "../models/usersModel";


async function addUser(req:Request, res:Response){
    const body = req.body;
    const user = await usersModel.addUser(body);
    res.status(201);
    res.send(user);
}

export default {addUser};