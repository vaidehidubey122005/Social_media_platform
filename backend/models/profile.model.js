import mongoose from "mongoose";
const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        default: ''
    },
    fieldOfStudy: {
        type: String,
        default: ''
    }
});
const workSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: ''
    },
    years: {
        type: String,
        default: ''
    }
});
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    currentPost: {
        type: String,
        default: ''
    },
    postWork: {
        type: [workSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    }
});

const ProfileModel = mongoose.model("Profile", profileSchema);

export default ProfileModel;