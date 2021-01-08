import {Request, Response} from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SALT from "../salt";
import UserModel from "../models/user";

const postSignup = async (request: Request, response: Response)=>{
    try {
        let {firstName, lastName, email, password} : {firstName:string, lastName:string, email:string, password:string} = request.body;
        let user = await UserModel.findOne({email: email});
        // console.log("user is ", user);
        if(user !== null){
            return response.status(400).json({msg: `User with email ${email} already exists`});
        }
        let hashedPassword = bcrypt.hashSync(password, SALT);
        let newUser = new UserModel({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword
        });
        await newUser.save();
        return response.json(newUser);
    }
    catch (err){
        return response.status(500).json({err: err.message});
    }
}


const postSignin = async (request: Request, response: Response)=>{
    try {
        const {email, password} : {email: string, password: string} = request.body;
        let user = await UserModel.findOne({email: email});
        if(user === null){
            return response.status(404).json({msg: `User with email ${email} doesn't exists`});
        }
        else{
            let isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if(!isPasswordCorrect){
                return response.status(401).json({msg: `Password is incorrect`});
            }
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
                expiresIn: 86400 // 24 hours
            });
            return response.json({accessToken: token});
        }
    }
    catch (err) {
        return response.status(500).json({err: err.message});
    }
}


export default {
    postSignup,
    postSignin
}