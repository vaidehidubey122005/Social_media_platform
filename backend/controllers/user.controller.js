import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const convertUserDataTOPDF = (userData) => {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.resolve("uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const outputFileName = `${crypto.randomBytes(32).toString("hex")}.pdf`;
    const outputPath = path.join(uploadsDir, outputFileName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    const basicInfo = [
      ["Name", userData?.userId?.name],
      ["Username", userData?.userId?.username],
      ["Email", userData?.userId?.email],
      ["Bio", userData?.bio],
      ["Current Post", userData?.currentPost],
      ["Past Work", userData?.pastWork],
      ["Education", userData?.education],
      ["Skills", userData?.skills],
    ];

    doc.fontSize(22).text("User Profile", { underline: true });
    doc.moveDown();

    basicInfo.forEach(([label, value]) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`${label}: `, { continued: true })
        .font("Helvetica")
        .text(value || "N/A");
      doc.moveDown(0.5);
    });

    doc.end();

    stream.on("finish", () => resolve(outputFileName));
    stream.on("error", reject);
    doc.on("error", reject);
  });
};

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
      userId: newUser._id
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


/* ---------- UPLOAD PROFILE PICTURE ---------- */

export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.json({
      message: "Profile picture updated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


/* ---------- UPDATE USER PROFILE ---------- */

export const updatedUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const { username, email } = newUserData;

    if (username || email) {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          message: "User with this email or username already exists"
        });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.json({
      message: "User updated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


/* ---------- GET USER + PROFILE ---------- */

export const getUserAndProfile = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name username email profilePicture");

    return res.json({
      user: userProfile
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


/* ---------- UPDATE PROFILE DATA ---------- */

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required"
      });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    Object.assign(profile, newProfileData);

    await profile.save();

    return res.json({
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("userId", "name username email profilePicture");   
    return res.json({
      profiles
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  } 
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    if (!user_id) {
      return res.status(400).json({
        message: "User id is required"
      });
    }

    const userProfile = await Profile.findOne({ userId: user_id })
      .populate("userId", "name username email profilePicture");

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    const pdfFileName = await convertUserDataTOPDF(userProfile);

    return res.json({
      message: "PDF generated successfully",
      pdfUrl: `/uploads/${pdfFileName}`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
