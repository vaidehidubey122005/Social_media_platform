import { Router } from "express";
import { getAllUserProfile } from "../controllers/user.controller.js";
import {
  register,
  login,
  uploadProfilePicture,
  updatedUserProfile,
  getUserAndProfile
} from "../controllers/user.controller.js";

import multer from "multer";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("profile_picture"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
router.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  uploadProfilePicture
);
router.post("/register", register);
router.post("/login", login);

router.get("/get_user_profile", getUserAndProfile);
router.post("/update_profile", updatedUserProfile);
router.get("/get_all_users", getAllUserProfile);

router.route("/user/download_resume");



export default router;