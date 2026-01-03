import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    message : {
        text : {
            type : String,
            required:true,
        },
    },
    users: Array,
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
}, {timestamps : true});

const MessageModel = mongoose.model('messages', MessageSchema);

export default MessageModel;