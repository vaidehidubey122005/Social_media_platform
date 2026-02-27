import { Router } from "express";
import { register, login, uploadProfilePicture } 
from "../controllers/user.controller.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("profile_picture"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post("/update_profile_picture",
    upload.single("profile_picture"),
    uploadProfilePicture
);

router.post("/register",
    upload.single("profile_picture"),
    register
);

router.post("/login", login);

export default router;