import { Request, Response, NextFunction } from "express"
import CommentModel from "../models/comment";
import PostModel from "../models/post";
import UserModel from "../models/user";

const createPost = async (request: Request, response: Response, next: NextFunction) => {
    try {
        let post = new PostModel({
            creationTime: new Date(),
            createdBy: request.userId,
            image: request.file ? request.file.path : undefined,
            body: request.body.body,
        });
        await post.save();
        return response.json(post);
    } catch (err) {
        next(err);
    }
}

const fetchPosts = async (request: Request, response: Response, next: NextFunction) => {
    try {
        let res: any[] = [];
        let curUser = await UserModel.findById(request.userId);
        let filter = curUser?.followings;
        filter?.push(curUser?._id);
        let posts = await PostModel.find({createdBy:{$in: curUser?.followings}}).sort("-creationTime").populate("createdBy").populate("likes");
        for (let post of posts) {
            let cur: { post: any, comments: any[] } = { post: {}, comments: [] };
            cur["post"] = post;
            let comments = await CommentModel.find({ post: post._id }).populate("createdBy");
            cur["comments"] = comments;
            res.push(cur);
        }
        return response.json(res);
    } catch (err) {
        next(err);
    }
}

const putLikeParams = ["postId"];
const putLike = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const {postId} = request.body;
        const post = await PostModel.findOneAndUpdate({_id: postId}, {$addToSet: {likes: request.userId}}, {new: true}).populate("likes");
        if(post === null){
            return response.status(404).json({msg: `Post with id ${postId} doesn't exists`});
        }
        else{
            return response.json(post.likes);
        }

    } catch (err) {
        next(err);
    }
}

const deleteLikeParams = ["postId"];
const deleteLike = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const {postId} = request.body;
        const post = await PostModel.findOneAndUpdate({_id: postId}, {$pull: {likes: request.userId }}, {new: true}).populate("likes");
        if(post === null){
            return response.status(404).json({msg: `Post with id ${postId} doesn't exists`});
        }
        else{
            return response.json(post.likes);
        }
    } catch (err) {
        next(err);
    }
} 

export default {
    createPost,
    fetchPosts,
    putLike,
    deleteLike,

    putLikeParams,
    deleteLikeParams,
}