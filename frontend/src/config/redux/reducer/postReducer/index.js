import { createSlice } from "@reduxjs/toolkit";
import { createPostAction, getAllPostsAction, deletePostAction ,toggleLikePostAction,createCommentAction} from "../../action/postAction";

const initialState = {
  posts: [],
   comments: {},
  loading: false,
  error: null,
  success: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Create post
    builder
      .addCase(createPostAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createPostAction.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // add new post on top
        state.success = "Post created successfully!";
      })
      .addCase(createPostAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Post creation failed";
      });

    // Get all posts
   
builder
  .addCase(getAllPostsAction.pending, (state) => {
    state.loading = true;
  })
  .addCase(getAllPostsAction.fulfilled, (state, action) => {
    state.loading = false;
    // Make sure posts is always an array
    state.posts = action.payload.posts || [];
  })
  .addCase(getAllPostsAction.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to fetch posts";
    state.posts = []; // ensure posts is always an array even on error
  });
  builder.addCase(createCommentAction.fulfilled, (state, action) => {
  const comment = action.payload;
  const postId = comment.postId;

  if (!state.comments[postId]) {
    state.comments[postId] = [];
  }

  state.comments[postId].unshift(comment);
});


    // Delete post
    builder
      .addCase(deletePostAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePostAction.fulfilled, (state, action) => {
        state.loading = false;
      state.posts = state.posts.filter(post => post._id !== action.payload.deletedPostId);

        state.success = "Post deleted successfully!";
      })
      .addCase(deletePostAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete post";
      });
 builder.addCase(toggleLikePostAction.fulfilled, (state, action) => {
  const { postId, likesCount, liked } = action.payload;

  const post = state.posts.find((p) => p._id === postId);

  if (post) {
    post.likesCount = likesCount;
    post.liked = liked;
  }
});


  },

});
export const { clearPostMessages } = postSlice.actions;
export default postSlice.reducer;
