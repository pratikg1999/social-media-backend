import {NextFunction, Request, Response} from "express";
import fs from "fs";
import UserModel from "../models/user";
const getInfo = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = request.params.id;
        let user = await UserModel.findById(id).populate("followings");
        if(user === null){
            return response.status(404).json({msg: `User with id ${id} doesn't exists`});
        }
        else{
            let res : any = user.toJSON();
            let followers =  await UserModel.find({"followings" : user._id});
            res["followers"] = followers;
            res["isFollowing"] = false;
            let loginUser = await UserModel.findById(request.userId);
            if(loginUser?.followings.includes(user._id)){
                res["isFollowing"] = true;
            }
            return response.json(res);
        }
    }
    catch (err) {
        next(err);
    }
}

const updateInfo = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request?.userId;
        delete request.body.email; // email can't be updated
        if(request.file){
            console.log("file found");
            request.body.profileImage = request.file.path;
        }
        // let oldUser = await UserModel.findById(userId);
        // if(oldUser!==null && oldUser?.profileImage){
        //     fs.unlink(oldUser.profileImage, ()=>{});
        // }
        // no need to delete profile photo as it is already overiden and updated
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


const getFollowings = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let user = await UserModel.findById(request.userId).populate("followings");
        let followings = user?.followings;
        return response.json(followings);
    }
    catch (err) {
        next(err);
    }
}

const putFollowingParams = ["followingId"];
const putFollowing = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let {followingId} = request.body; 
        let followingUser = await UserModel.findById(followingId);
        if(followingUser === null){
            return response.status(400).json({msg: `User with id ${followingId} doesn't exists`});
        }
        else{
            let curUser = await UserModel.findOneAndUpdate({_id: request.userId}, {$addToSet: {followings: followingId}}, {new : true}).populate("followings");
            let followings = curUser?.followings;
            return response.json(followings);
        }
    }
    catch (err) {
        next(err);
    }
}

const deleteFollowingParams = ["followingId"];
const deleteFollowing = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let {followingId} = request.body; 
        let curUser = await UserModel.findOneAndUpdate({_id: request.userId}, {$pull: { followings: followingId}}, {new:true}).populate("followings");
        return response.json(curUser?.followings);
    }
    catch (err) {
        next(err);
    }
}

const getFollowers = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let followers =  await UserModel.find({"followings" : request.userId});
        return response.json(followers);
    }
    catch (err) {
        next(err);
    }
}

const getUsers  = async (request: Request, response: Response, next: NextFunction)=>{
    try {
        let users =  await UserModel.find();
        return response.json(users);
    }
    catch (err) {
        next(err);
    }
}

export default {
    getInfo,
    updateInfo,
    getCurrentUserInfo,
    getFollowings,
    putFollowing,
    getFollowers,
    getUsers,
    deleteFollowing,

    putFollowingParams,
    deleteFollowingParams,
}