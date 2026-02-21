import { Router } from "express";
import { register, login } from "../controllers/user.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, 'profile_picture/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


router.post("/register", register);
router.post("/login", login);

export default router;
