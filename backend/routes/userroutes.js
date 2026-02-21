import { Router } from "express";
import { register, login } from "../controllers/user.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, 'profile_picture/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/register", register);
router.post("/login", login);

export default router;
