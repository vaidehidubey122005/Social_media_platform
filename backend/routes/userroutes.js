import { Router } from "express";
import { register, login, uploadProfilePicture, updatedUserProfile, getUserAndProfile } 
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

router.post(
    "/update_profile_picture",
    upload.single("profile_picture"),
    uploadProfilePicture
);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updatedUserProfile)
router.route('/get_user_and_profile').get(getUserAndProfile)
router.route("/update_profile_data").post(updateProfileData)
export default router;