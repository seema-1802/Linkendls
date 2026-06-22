import { Router } from "express";

import {registerUser,login,uploadProfileImage,updateUserProfile,getUserWithProfile, getAllUserProfile,generateResume,updateProfileData, sendConnectedRequest, getMyConnectedRequests,  getMyAcceptedConnections, respondConnection,getUserByName,googleLogin } from "../controllers/user.controllers.js"
import multer from 'multer';
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const router =Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  
  },
   filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");

    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post('/upload-profile', upload.single('profileImage'),uploadProfileImage
);
router.route("/signup").post(registerUser);
router.route("/login").post(login);
  router.route("/logout").post( (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

 router.post("/google-login", googleLogin); 
// ✅ Update user profile (with multer)
router.post("/userUpdate", upload.single("profileImage"), updateUserProfile);
router.post("/updateProfileData", updateProfileData);
// get use profile see
  router.route('/getUserProfile/:id').get(getUserWithProfile);


  // get all user see
  router.route('/user/get_all_users').get(getAllUserProfile);

router.get("/generateResume/:userId",generateResume);

// Send connection
router.post("/user/sendConnectedRequest", sendConnectedRequest);

// Get all my connections (sent + received)
router.get("/user/getMyConnectedRequests/:userId", getMyConnectedRequests);

router.get("/user/getMyAcceptedConnections/:userId", getMyAcceptedConnections);
router.post("/user/respondConnection", respondConnection);
router.post("/forgotPassword", forgotPassword);
router.post(
  "/resetPassword/:token",
  resetPassword
);
// ✅ New route to get user by name
router.get("/user/getUserByName/:name", getUserByName);
//  .post((req, res) => {
//   req.session.destroy(err => {
//     if (err) return res.status(500).json({ error: "Logout failed" });
//     res.clearCookie('connect.sid'); // session cookie clear karo
//     res.status(200).json({ message: "Logged out successfully" });
//   });
// });

export default router;


