import mongoose, { Document, mongo } from "mongoose";
import { IUser } from "./user";

export interface IPost extends Document {
    creationTime: Date,
    createdBy: IUser["_id"];
    body: string,
    image: string,
    likes: IUser["_id"][];
}

export interface IPostModel extends mongoose.Model<IPost> {
}

const postSchema = new mongoose.Schema({
    creationTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String },
    image: { type: String },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
});

const PostModel: IPostModel = mongoose.model<IPost, IPostModel>("Post", postSchema);
export default PostModel;