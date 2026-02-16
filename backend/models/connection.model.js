import mongoose from "mongoose";

const connectionRequest = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        red: 'User'
    },
    connectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status_accpected:{
        type: Boolean,
        default: null,
    }

});
const ConnectionModel = mongoose.model("Connection", connectionRequest);
export default ConnectionModel;