import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUserModel extends mongoose.Model<IUser>{

}

const userSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique:true},
    password: {type: String, required:true}, // select:false was not working
});

userSchema.set('toJSON', {
    transform: function(doc:IUser, ret: any, options: any) {
        delete ret.password;
        return ret;
    }
});

const UserModel : IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default UserModel;