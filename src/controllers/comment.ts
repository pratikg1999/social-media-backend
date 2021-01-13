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
            comment = await comment.save();
            comment = await comment.populate("createdBy").execPopulate();
            return response.json(comment);
        }

    } catch (err) {
        next(err);
    }
}

const deleteComment = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const commentId = request.params.commentId;
        let comment = await CommentModel.findById(commentId);
        if(comment === null){
            return response.status(404).json({ msg: `Comment with id ${commentId} doesn't exists` });
        }
        if (comment?.createdBy != request.userId) {
            return response.status(403).json({ msg: `Comment with id ${commentId} wan't created by you` });
        }
        let res = await CommentModel.remove({_id: commentId});
        return response.json(res);
    } catch (err) {
        next(err);
    }
}
export default {
    createComment,
    deleteComment,
}