import {NextFunction, Request, Response} from "express";
import { nextTick } from "process";
import UserModel from "../models/user";
const getInfo = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = request.params.id;
        let user = await UserModel.findById(id);
        if(user === null){
            return response.status(404).json({msg: `User with id ${id} doesn't exists`});
        }
        else{
            return response.json(user);
        }
    }
    catch (err) {
        next(err);
    }
}

const updateInfo = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId: string = response.locals.userId;
        delete request.body.email; // email can't be updated
        if(request.file != null){
            console.log("file found");
            request.body.profileImage = request.file.path;
        }
        let updatedUser = await UserModel.findOneAndUpdate({_id: userId}, {...request.body}, {new: true});
        return response.json(updatedUser);
    }
    catch (err) {
        next(err);
    }
}

const getCurrentUserInfo = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let user = await UserModel.findById(request.userId);
        return response.json(user);
    }
    catch (err) {
        next(err);
    }
}

export default {
    getInfo,
    updateInfo,
    getCurrentUserInfo,
}