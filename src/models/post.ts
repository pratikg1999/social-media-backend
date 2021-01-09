import mongoose, { Document } from "mongoose";
import { IUser } from "./user";

export interface IPost extends Document {
    createdBy: IUser["_id"];
    likesCount: number,
    body: string,
    image: string,
}

export interface IPostModel extends mongoose.Model<IPost> {
}

const postSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likesCount: { type: Number, default: 0 },
    body: { type: String },
    image: { type: String },
});

const PostModel: IPostModel = mongoose.model<IPost, IPostModel>("Post", postSchema);
export default PostModel;