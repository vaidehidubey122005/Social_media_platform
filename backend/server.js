import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/postsroute.js";
import userRoutes from "./routes/userroutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);


const start =async ()=>{
    const connectDB= await mongoose.connect("mongodb+srv://vaidehidubey121_db_user:gauri122005@apnaconnection.omzhkwt.mongodb.net/?appName=ApnaConnection")
    app.listen(9090, ()=>{
        console.log("Server is running on port 9090")
    })
}
start();
