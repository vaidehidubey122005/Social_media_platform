import User from "../models/user.model.js";
export const activeCheck = async(req , res) =>{

    return res.status(200).json({message: "RUNNING"})
}

export const register = async(req , res) =>{


    try{  
        const {name , email , password} = req.body;

        if(!name || !email || !password ||!username){
            return res.status(400).json({message: "Please fill all the fields"})
        }

        const user = await User.finOne({email
        });

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await newUser.save();
        const profilr = new Profile({
            userId: newUser._id,
        });
        return res.status(201).json({message: "User registered successfully"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }

}