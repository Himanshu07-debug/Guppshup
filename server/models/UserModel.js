import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        min : 3,
        max : 50,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        min : 5,
        max : 20
    },
    password : {
        type : String,
        required : true,
    },
    isAvatarSet : {
        type : Boolean,
        default : false,
    },
    avatarPath : {
        type : String,
        default : ""
    },
    contacts : {
        type : Array,
        default : []
    }
})

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;