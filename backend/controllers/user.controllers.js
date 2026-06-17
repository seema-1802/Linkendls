import User from "../models/User.js";
import passport from "passport";
import Profile from '../models/Profile.js';

import Connection from "../models/Connection.js";

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

import jwt from "jsonwebtoken";
export const googleLogin = async (req, res) => {
  try {
    c

    const email = req.body?.email;
    const name = req.body?.name;
    const googleId = req.body?.googleId;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email missing from Google login",
      });
    }

    let user = await User.findOne({ Email: email });

    if (!user) {
      user = await User.create({
        Name: name || "Google User",
        Email: email,
        googleId,
        authProvider: "google",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.log("Google Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message, // IMPORTANT
    });
  }
};
export const  registerUser=async(req,res)=>{
  
     const{Name,Email,Password}=req.body
     try{
        if(!Name||!Email||!Password){
              return res.status(400).send({ error: "All fields are required" });
        } 
        const exist=await User.findOne({Email});
        if(exist){
            return  res.status(409).json({ error: "User already exists with this email." });
        }
        
        const newuser = new User({
            Name,
            Email,
            
        });
        const registeredUser = await User.register(newuser, Password);

    res.status(201).json({
      message: "User registered successfully",
      user: {
           id: registeredUser._id,
        Name: registeredUser.Name,
        Email: registeredUser.Email,
         ProfileImage: registeredUser.ProfileImage,
        
      }
    });

        const profile = new Profile({ userId: registeredUser._id });
await profile.save();

     }catch (err){
        console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
     }
}


export const login = (req, res, next) => {
  const { Email, Password } = req.body;


  if (!Email || !Password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid email or password" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return res.status(500).json({ error: "Login failed" });
      }

      return res.json({
        message: "Logged in successfully",
        user: {
           id: user._id.toString(),
          Name: user.Name,
          Email: user.Email,
        },
      });
    });
  })(req, res, next);
};
// Upload profile image handler


export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // or full URL if you prefer

    // Find user by ID and update profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ProfileImage: imageUrl },
      { new: true }  // to return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile image uploaded and updated successfully",
      user: updatedUser,
    });
  } catch (err) {
   console.error("UPDATE USER PROFILE ERROR:", error);

  res.status(500).json({
    error: error.message,
    stack: error.stack,
  });  
  }
};

// update only use data
export const updateUserProfile = async (req, res) => {
  try {
  console.log("BODY:", req.body);
    console.log("FILE:", req.file);

     const { userId, Name, Email } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const updateData = {};
    if (Name) updateData.Name = req.body.Name;
    if (Email) updateData.Email = req.body.Email;
    if (req.file) updateData.ProfileImage = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
  } catch (error) {
   console.error("UPDATE USER PROFILE ERROR:", error);

  res.status(500).json({
    error: error.message,
    stack: error.stack,
  });  
  }
};


// 🔹 Update only profile data
export const updateProfileData = async (req, res) => {
  try {
    const { userId, bio, currentPosition, education, work } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Prepare update object dynamically
    const updateData = {};
    if (bio) updateData.bio = bio;
    if (currentPosition) updateData.currentPosition = currentPosition;
    if (education) updateData.education = education;
    if (work) updateData.work = work;

    // Find and update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true } // upsert creates if not exists
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error while updating profile" });
  }
};

// get use profile
export const getUserWithProfile = async (req, res) => {
  const { id } = req.params;

  try {
    
    const user = await User.findOne({ _id: id }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'Name Email ProfileImage');


    res.status(200).json({  userProfile });
    

  } catch (err) {
    
    res.status(500).json({ error: 'Server Error' });
  }
};



//  GET ALL USER PROFILES
export const getAllUserProfile = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



export const generateResume = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Fetch User + Profile data
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // 📁 Ensure folder exists
    const resumeDir = path.join("uploads", "resumes");
    if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
    const filePath = path.join(resumeDir, `${userId}_resume.pdf`);

    // 🖋️ Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // 🎨 Color Theme
    const primary = "#003366";
    const secondary = "#666666";

    // 🖼️ Profile Image Handling
    let imagePath = null;
    try {
      if (user.ProfileImage?.startsWith("/uploads/")) {
        imagePath = path.join(process.cwd(), user.ProfileImage);
      } else if (user.ProfileImage?.startsWith("http")) {
        const response = await fetch(user.ProfileImage);
        const buffer = await response.arrayBuffer();
        imagePath = path.join("uploads", "tempProfile.png");
        fs.writeFileSync(imagePath, Buffer.from(buffer));
      }
    } catch (err) {
      console.error("Image load failed:", err);
    }

    // 🧩 Header Section (photo + name + contact)
    if (imagePath && fs.existsSync(imagePath)) {
      doc.image(imagePath, 50, 40, { width: 100, height: 100, align: "left" });
    }

    doc
      .fontSize(22)
      .fillColor(primary)
      .text(user.Name || "_", 170, 50, { continued: false });

    doc
      .fontSize(12)
      .fillColor(secondary)
      .text(`Email: ${user.Email || "_"}`, 170, 80);

    doc
      .fontSize(12)
      .fillColor(secondary)
      .text(`Profile Created: ${new Date(user.CreatedAt).toDateString()}`, 170, 100);

    // Draw a divider line
    doc.moveTo(50, 160).lineTo(550, 160).strokeColor(primary).stroke();

    // 🧠 About Me
    doc.moveDown(2);
    doc.fontSize(16).fillColor(primary).text("About Me", { underline: true });
    doc
      .moveDown(0.5)
      .fontSize(12)
      .fillColor("black")
      .text(profile.bio || "_", { align: "left", lineGap: 4 });

    // 🎓 Education Section
    doc.moveDown(1.5);
    doc.fontSize(16).fillColor(primary).text("Education", { underline: true });
    if (profile.education?.length) {
      profile.education.forEach((edu, i) => {
        doc
          .moveDown(0.5)
          .fontSize(12)
          .fillColor("black")
          .text(`${i + 1}. ${edu.degree || "_"} in ${edu.fieldOfStudy || "_"}`)
          .text(`Institute: ${edu.school || "_"}`)
          .text(`Year: ${edu.startYear || "_"} - ${edu.endYear || "_"}`);
      });
    } else {
      doc.moveDown(0.5).fontSize(12).text("_");
    }

    // 💼 Work Experience
    doc.moveDown(1.5);
    doc.fontSize(16).fillColor(primary).text("Work Experience", { underline: true });
    if (profile.work?.length) {
      profile.work.forEach((job, i) => {
        doc
          .moveDown(0.5)
          .fontSize(12)
          .fillColor("black")
          .text(`${i + 1}. ${job.position || "_"} at ${job.company || "_"}`)
          .text(`Location: ${job.location || "_"}`)
          .text(
            `Duration: ${job.startDate ? new Date(job.startDate).getFullYear() : "_"} - ${
              job.currentlyWorking
                ? "Present"
                : job.endDate
                ? new Date(job.endDate).getFullYear()
                : "_"
            }`
          );
      });
    } else {
      doc.moveDown(0.5).fontSize(12).text("_");
    }

    // 🧾 Footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#888888")
      .text("Auto-generated by Linkedlns Resume Builder © 2025", {
        align: "center",
      });

    doc.end();

    // Delete temp image
    if (imagePath?.includes("tempProfile") && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    writeStream.on("finish", () => {
      res.download(filePath, `${user.Name}_Resume.pdf`);
    });
  } catch (err) {
    console.error("Error generating resume:", err);
    res.status(500).json({ error: "Server error while generating resume" });
  }
};
// send connected
export const sendConnectedRequest = async (req, res) => {
  try {
    const { userId, connectId } = req.body;

    if (!userId || !connectId) {
      return res.status(400).json({ error: "Both userId and connectId are required" });
    }

    if (userId === connectId) {
      return res.status(400).json({ error: "You cannot connect with yourself" });
    }

    // Check users exist
    const user = await User.findById(userId);
    const connectUser = await User.findById(connectId);
    if (!user || !connectUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if request already exists in **either direction**
    const existing = await Connection.findOne({
      $or: [
        { userId, connectId },
        { userId: connectId, connectId: userId }
      ]
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({ error: "Connection request already pending" });
      } else if (existing.status === "accepted") {
        return res.status(400).json({ error: "You are already connected" });
      }
    }

    // Create new connection
    const newConnection = new Connection({ userId, connectId, status: "pending" });
    await newConnection.save();

    res.status(201).json({
      message: "Connection request sent successfully",
      connection: newConnection,
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Server error while sending request" });
  }
};

// get my connected
export const getMyConnectedRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find all requests where the user is either sender or receiver
    const connections = await Connection.find({
      $or: [{ userId }, { connectId: userId }],
    })
      .populate("userId", "Name Email ProfileImage")
      .populate("connectId", "Name Email ProfileImage");

    res.status(200).json({
      message: "Connections fetched successfully",
      total: connections.length,
      connections,
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ error: "Server error while fetching connections" });
  }
};
// accepted my connection
export const getMyAcceptedConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const acceptedConnections = await Connection.find({
      $and: [
        {
          $or: [{ userId }, { connectId: userId }],
        },
        { status: "accepted" },
      ],
    })
      .populate("userId", "Name Email ProfileImage")
      .populate("connectId", "Name Email ProfileImage");

    res.status(200).json({
      message: "Accepted connections fetched successfully",
      total: acceptedConnections.length,
      connections: acceptedConnections,
    });
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    res.status(500).json({ error: "Server error while fetching accepted connections" });
  }
};
//accept and rejected 
export const respondConnection = async (req, res) => {
  try {
    const { connectionId, status } = req.body;

    if (!connectionId || !status) {
      return res.status(400).json({ error: "Connection ID and status are required" });
    }

    

    const connection = await Connection.findOne({ _id: connectionId });
    if (!connection) {
      console.log("No connection found for:", connectionId);
      return res.status(404).json({ error: "Connection not found" });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({
      message: `Connection ${status} successfully`,
      connection
    });
  } catch (error) {
    console.error("Error in respondConnection:", error);
    res.status(500).json({ error: "Server error" });
  }
 };


export const getUserByName = async (req, res) => {
  const { name } = req.params; // get name from URL

  try {
    // find a single user by name
    const user = await User.findOne({ Name: name }).select('-hash -salt'); // remove password fields
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'Name Email ProfileImage');

    res.status(200).json({ user, profile: userProfile });
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: 'Server Error' });
  }
};

// export default User;
// get me  const { name } = req.query;
//router.get("/user")
////ye fronted ke liye
// const router = useRouter();
 // const { name } = router.query;
 //////next.js ke liye ye use kare
 //import { useSearchParams } from "next/navigation";
 // const name = searchParams.get("name");
