import {NextFunction, Request, Response} from "express";
import PostModel from "../models/post";
import CommentModel from "../models/comment";

const createComment = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const postId = request.body.post;
        const {body} = request.body;
        let post = await PostModel.findById(postId);
        if(post === null){
            return response.status(404).json({msg: `Post with id ${postId} doesn't exists`});
        }
        else{
            let comment = new CommentModel({
                creationTime: new Date(),
                createdBy: request.userId,
                post: postId,
                body: body,
            });
            await comment.save();
            return response.json(comment);
        }

    } catch (err) {
        next(err);
    }
}

export default {
    createComment,
}