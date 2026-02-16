import mongoose from "mongoose";
const PostSchema =mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    body:{
       type:String,
         required:true
    },
    likes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    media:{
        type:String,
        default:''
    },
    active:{
        type:Boolean,
        default:true
    },
    fileType:{
        type:String,
        default:''
    },

});
const PostModel = mongoose.model("Post",PostSchema);
export default PostModel;