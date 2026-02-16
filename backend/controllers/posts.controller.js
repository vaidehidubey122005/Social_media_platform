import User from "../models/user.model.js";
export const activeCheck = async(req , res) =>{

    return res.status(200).json({message: "RUNNING"})
}

const register = async(req , res) =>{


    try{
        const {name , email , password} = req.body;

        if(!name || !email || !password ||!username){
            return res.status(400).json({message: "Please fill all the fields"})
        }

        const user = await User.finOne({email
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }

}