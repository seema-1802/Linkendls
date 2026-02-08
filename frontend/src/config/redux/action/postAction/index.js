import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

// Create a post
export const createPostAction = createAsyncThunk(
  "post/createPost",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.post("/post/createPost", postData); 
      // default axios content-type is application/json
      return response.data.post;
    } catch (error) {
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
      const response = await clientServer.post("/post/deletePost", { postId, userId }); // ✅ add /post
      return response.data;
    } catch (error) {
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
      return response.data.comment;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Create comment failed"
      );
    }
  }
);