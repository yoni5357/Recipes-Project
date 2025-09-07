import { sequelize } from "../connections"
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

type registeredUser = {
    id:string,
    username:string,
    email:string,
    firstName:string,
    lastName:string
}

type userBody = {
    username:string,
    email:string,
    password:string,
    firstName:string,
    lastName:string
}

type fullUser = {
    id:string,
    username:string,
    password:string,
    email:string,
    firstName:string,
    lastName:string
}

function encryptPassword(password:string){
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password,salt);
}

async function addUser(body:userBody){
    const id = uuidv4();
    const username = body.username;
    const email = body.email;
    const password = encryptPassword(body.password);
    const firstName = body.firstName;
    const lastName = body.lastName;
    await sequelize.query(
        `INSERT INTO users (id,username,email,password,firstName,lastName)
         VALUES(:id,:username,:email,:password,:firstName,:lastName)`,
        {
            replacements:{
                id,
                username,
                email,
                password,
                firstName,
                lastName,
            }
        }
    )
    return {id,username,email,firstName,lastName} as registeredUser
}

async function getUserByEmail(email:string){
    const [result] = await sequelize.query(
        `SELECT * FROM users
        WHERE email = :email`,
        {
            replacements:{email},
        }
    )
    console.log(result);
    const user = result[0] as fullUser;
    return user;
}

export default {addUser,getUserByEmail};