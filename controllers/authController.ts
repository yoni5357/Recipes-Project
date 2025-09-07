import { Request, Response } from "express";
import usersModel from "../models/usersModel";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bycript from 'bcryptjs';
dotenv.config();


async function addUser(req:Request, res:Response){
    const body = req.body;
    const user = await usersModel.addUser(body);
    const token = jwt.sign(user,process.env.JWT_SECRET);
    res.status(201);
    res.send({success:true,status:201,message:"User registered successfully",user:{...user},token});
}

function isCorrectPassword(password:string,encryptedPassword:string){
    return bycript.compareSync(password,encryptedPassword)
}

async function loginUser(req:Request,res:Response){
    const email = req.body.email;
    const password = req.body.password;
    const user = await usersModel.getUserByEmail(email);
    if(!user){
        res.status(400);
        res.send("Invalid Email");
    }
    if(!isCorrectPassword(password,user.password)){
        res.status(400);
        res.send("Invalid User Password");
    }
    const token = jwt.sign(user,process.env.JWT_SECRET);
    res.status(200);
    res.send({
        success:true,
        status:200,
        message:"Login Successful",
        user:{
            id:user.id,
            username:user.username,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName
        },
        token
    });
}

async function getUserProfile(req:Request,res:Response){
    const email = req.user.email;
    const user = await usersModel.getUserByEmail(email)
    res.status(200);
    res.send({            
        id:user.id,
        username:user.username,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName
    });
}

export default {addUser,loginUser,getUserProfile};