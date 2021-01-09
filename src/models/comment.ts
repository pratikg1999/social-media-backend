import mongoose, { Document } from "mongoose";
import { IUser } from "./user";
import { IPost } from "./post";

export interface IComment extends Document {
    createdBy: IUser["_id"];
    body: string;
    post: IPost["_id"];
}

export interface ICommentModel extends mongoose.Model<IComment> {

}

const commentSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const CommentModel: ICommentModel = mongoose.model<IComment, ICommentModel>("Comment", commentSchema);

export default CommentModel;