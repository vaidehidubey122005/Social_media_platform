import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        const profile = new Profile({
            userId: newUser._id,
        });

        await profile.save();

        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({ _id: user._id }, { token });
        user.token = token;
        await user.save();

        return res.json({ token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const uploadProfilePicture = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;
        
        const user = await User.findOne({token : token});

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const { username, name, email} = newUserData;
        
        user.profilePicture = req.file.filename;
        await user.save();
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
       if(existingUser) {
        if(existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({
                message: "User with this email or username already exists"
            });
        }
        }
    Object.assign(user, newUserData);
    await user.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};