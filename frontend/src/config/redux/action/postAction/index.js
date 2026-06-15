import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
import Swal from "sweetalert2";
// Create a post
export const createPostAction = createAsyncThunk(
  "post/createPost",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.post("/post/createPost", postData); 
      // default axios content-type is application/json
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Post created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      return response.data.post;
    } catch (error) {
       Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Create post failed",
      });
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Create post failed"
      );
    }
  }
);


// Get all posts
export const getAllPostsAction = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/post/getAllPosts");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Fetching posts failed"
      );
    }
  }
);
export const deletePostAction = createAsyncThunk(
  "post/deletePost",
  async ({ postId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post("/post/deletePost", { postId, userId });
        Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Post deleted successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      return response.data;
    } catch (error) {
       Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Delete post failed",
      });
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Delete post failed"
      );
    }
  }
);


export const toggleLikePostAction = createAsyncThunk(
  "post/toggleLikePost",
  async ({ postId, userId }, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/post/toggleLikePost",
        { postId, userId }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Toggle like failed"
      );
    }
  }
);


// Comments can be similar

export const createCommentAction = createAsyncThunk(
  "post/createComment",
  async ({ postId, userId, body }, thunkAPI) => {
    try {
      const response = await clientServer.post("/post/createComment", {
        postId,
        userId,
        body,
      });
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Comment added successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      return response.data.comment;
    } catch (error) {
       Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Create comment failed",
      });
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Create comment failed"
      );
    }
  }
);