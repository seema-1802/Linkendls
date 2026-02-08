import express from "express";
import { createPost, uploadPostMedia, getAllPosts, deletePost, createComment,
  getCommentsByPost,
  deleteComment,toggleLikePost ,getSinglePost} from "../controllers/post.controllers.js";

const router = express.Router();


router.post("/createPost", uploadPostMedia.array("media", 5), createPost);
// get all post 
router.get("/getAllPosts", getAllPosts);
router.post("/deletePost", deletePost);

router.post("/createComment", createComment);
router.get("/getComments/:postId", getCommentsByPost);
router.post("/deleteComment", deleteComment);
router.post("/toggleLikePost", toggleLikePost);

router.get("/getSinglePost/:id", getSinglePost);
export default router;
