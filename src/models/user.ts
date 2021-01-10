import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImage: string;
    phone: string;
    followings: IUser["_id"][];
    bio: string;
}

export interface IUserModel extends mongoose.Model<IUser>{

}

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique:true},
    password: {type: String, required:true}, // select:false was not working
    profileImage: {type: String},
    phone: {type: String},
    followings: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    bio: {type: String},
});

userSchema.set('toJSON', {
    transform: function(doc:IUser, ret: any, options: any) {
        delete ret.password;
        return ret;
    }
});

const UserModel : IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default UserModel;