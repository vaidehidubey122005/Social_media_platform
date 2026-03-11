import { Router } from "express";
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

/* ---------- Multer Configuration ---------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("profile_picture"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* ---------- Authentication Routes ---------- */

router.post("/register", register);
router.post("/login", login);

/* ---------- User Profile Routes ---------- */

router.get("/get_user_profile", getUserAndProfile);
router.post("/update_profile", updatedUserProfile);

/* ---------- Profile Picture Upload ---------- */

router.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  uploadProfilePicture
);

export default router;