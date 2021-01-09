import { Request, Response, NextFunction } from "express"
import PostModel from "../models/post";

const createPost = async (request: Request, response: Response, next: NextFunction) => {
    try {
        let post = new PostModel({
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

export default {
    createPost
}