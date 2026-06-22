import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
// 🟢 Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("uploads", "posts");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const uploadPostMedia = multer({ storage });

// 🟢 Create Post Controller
export const createPost = async (req, res) => {
  try {
    const { userId, body } = req.body;

    if (!userId || !body) {
      return res.status(400).json({ error: "userId and body are required" });
    }

    // Handle uploaded files (if any)
   let mediaFiles = [];

if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "posts",
      resource_type: "auto",
    });

    mediaFiles.push({
      url: result.secure_url,
      fileType: file.mimetype.startsWith("image")
        ? "image"
        : file.mimetype.startsWith("video")
        ? "video"
        : file.mimetype.startsWith("audio")
        ? "audio"
        : "other",
    });

    fs.unlinkSync(file.path);
  }
}

    // Create new post
    const newPost = new Post({
      userId,
      body,
      media: mediaFiles,
    });

    await newPost.save();
 const populatedPost = await newPost.populate(
      "userId",
      "Name Email ProfileImage"
    );
    res.status(201).json({
      message: "Post created successfully",
      post:populatedPost ,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
};

// 🟢 Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "Name Email ProfileImage").sort({ createdAt: -1 });
    res.status(200).json({ message: "All posts fetched successfully", total: posts.length, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};
export const deletePost = async (req, res) => {
  try {
     console.log("Request body:", req.body);
    const { postId, userId } = req.body;
    if (!postId) return res.status(400).json({ error: "Post ID is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (userId && post.userId.toString() !== userId)
      return res.status(403).json({ error: "Not authorized to delete this post" });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully", deletedPostId: postId });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post" });
  }
};

// 🟢 CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { postId, userId, body } = req.body;

    if (!postId || !userId || !body) {
      return res.status(400).json({ error: "postId, userId and body are required" });
    }

    // ✅ Verify the post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Create comment
    const comment = await Comment.create({ postId, userId, body });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Server error while creating comment" });
  }
};

// 🟡 GET ALL COMMENTS FOR A POST
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) return res.status(400).json({ error: "postId is required" });

    const comments = await Comment.find({ postId })
      .populate("userId", "Name Email ProfileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Comments fetched successfully",
      total: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
};

// 🔴 DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { commentId, userId } = req.body;

    if (!commentId) return res.status(400).json({ error: "commentId is required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // 🧠 Optional: only allow comment owner to delete
    if (userId && comment.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment deleted successfully",
      deletedCommentId: commentId,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Server error while deleting comment" });
  }
};


//  LIKE or UNLIKE POST
export const toggleLikePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;// change in part


    if (!postId || !userId) {
      return res.status(400).json({ error: "postId and userId are required" });
    }

    //  Find the post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    //  Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      //  Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.status(200).json({
        message: "Post unliked successfully",
        likesCount: post.likes.length,
        postId: post._id,
      });
    } else {
      //  Like the post
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({
        message: "Post liked successfully",
        likesCount: post.likes.length,
        postId: post._id,
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server error while toggling like" });
  }
};
// 🟢 GET SINGLE POST
export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post id is required" });
    }

    const post = await Post.findById(id).populate(
      "userId",
      "Name Email ProfileImage"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json({ error: "Server error while fetching post" });
  }
};
