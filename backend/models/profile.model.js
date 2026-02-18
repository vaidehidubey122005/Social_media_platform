import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school:{
        type:String,
        required:true
    },
    degree:{
        type:String,
        default:''
    },
    fieldOfStudy:{
        type:String,
        default:''
    },
});

const WorkSchema = new mongoose.Schema({
    company:{
        type:String,
        required:true
    },
    position:{
        type:String,
        default:''
    },
    years:{
        type:String,
        default:''
    },
});

const ProfileSchema = new mongoose.Schema   ({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bio:{
        type:String,
        default:''
    },
    currentPost:
    {
        type:String,
        default:''
    },
    postWork:{
        type:[WorkSchema],
        default:'',
    },
    education:{
        type:[educationSchema],
        default:[]
    },
});

const ProfileModel = mongoose.model("Profile",ProfileSchema);
export default ProfileModel;