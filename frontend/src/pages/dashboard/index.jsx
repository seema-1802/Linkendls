import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaThumbsUp, FaCommentAlt, FaShare } from "react-icons/fa";
import {clientServer, BACKEND_URL } from '@/config';
import Swal from "sweetalert2";
import {
  getAllPostsAction,
  createPostAction,deletePostAction,toggleLikePostAction,createCommentAction 
} from "@/config/redux/action/postAction";
import { getUserProfile,getAllUsers } from "@/config/redux/action/authAction";

import Index from "@/layout/UserLayout";
import DashboardContent from "@/dashbord";




export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
    
 const authState = useSelector((state) => state.auth) || {};
const postState = useSelector((state) => state.post) || {};

const user = authState.user || null;
const posts = postState.posts || [];


  const [loadingAuth, setLoadingAuth] = useState(true);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
const [activeCommentPost, setActiveCommentPost] = useState(null);
const [commentText, setCommentText] = useState("");
const [comments, setComments] = useState({});


  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);


  
const handleDeleteComment = async (commentId, postId) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;

 await fetch(`${BACKEND_URL}/post/deleteComment`, {
  method: "POST",

    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, userId }),
  });

  fetchComments(postId);
};
const fetchComments = async (postId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/post/getComments/${postId}`);
    const data = await res.json();

    setComments((prev) => ({
      ...prev,
      [postId]: data.comments || [],
    }));
  } catch (err) {
    console.error("Error fetching comments", err);
  }
};


  // 🔐 AUTH + LOAD DATA
  useEffect(() => {
     console.log("DASHBOARD MOUNT");
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.replace("/login");
      return;
    }

    const parsedAuth = JSON.parse(auth);
    const userId = parsedAuth?.user?._id || parsedAuth?.user?.id;

    if (!userId) {
        console.log("REDIRECT LOGIN");
      router.replace("/login");
      return;
    }

    setLoadingAuth(false);
    dispatch(getUserProfile(userId));
    dispatch(getAllPostsAction());
  }, [dispatch, router]);

  if (loadingAuth) return <p>Checking authentication...</p>;

  // 📝 CREATE POST
  const handleSubmit = () => {
    if (!text && files.length === 0) return;

    const auth = JSON.parse(localStorage.getItem("auth"));
    const userId = auth?.user?._id || auth?.user?.id;
 
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("body", text);

    files.forEach((file) => {
      formData.append("media", file);
    });

    dispatch(createPostAction(formData));
     
    setText("");
    setFiles([]);
  };
 const handleDelete = (postId) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;

  dispatch(deletePostAction({ postId, userId }));
};
const handleNativeShare = async (post) => {
  const shareUrl = `${window.location.origin}/post/${post._id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this post",
        text: post.body || "View this post",
        url: shareUrl,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    copyLink(post);
  }
};

const copyLink = (post) => {
  const shareUrl = `${window.location.origin}/post/${post._id}`;
  navigator.clipboard.writeText(shareUrl);
  alert("Link copied!");
};


const handleToggleLike = (postId) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;
  
//  console.log("LIKE DATA:", { postId, userId });

if (!userId) {
    console.error("UserId missing");
    return;
  }
  dispatch(toggleLikePostAction({ postId, userId }));
};


const handleSendComment = async(postId) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;

  if (!commentText.trim()) return;

  await dispatch(
    createCommentAction({
      postId,
      userId,
      body: commentText,
    })
  );
   Swal.fire({
    icon: "success",
    title: "Success",
    text: "Comment added successfully!",
    timer: 1500,
    showConfirmButton: false,
  });

  setCommentText("");
};

 
  return (

    
    <Index>
      <DashboardContent>
        {/* CREATE POST BOX */}
        <div style={styles.createCard}>
       <img
  src={
    user?.ProfileImage
      ? user.ProfileImage.startsWith("http")
        ? user.ProfileImage
        : `${BACKEND_URL}${user.ProfileImage}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.Name || "User")}&background=random&color=fff&size=128`
  }
  alt="profile"
  style={styles.avatar}
/>



          <div style={{ flex: 1 }}>
            {/* USER INFO */}
            <div style={styles.userInfoBox}>
              <span style={styles.name}>{user?.Name}</span>
              <span style={styles.email}>{user?.Email}</span>
            </div>

            {/* TEXTAREA */}
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.textarea}
            />

            {/* ACTIONS */}
            <div style={styles.actions}>
              {/* ➕ IMAGE SELECT */}
              <label style={styles.addBtn}>
                <FaPlus />
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => setFiles([...e.target.files])}
                />
              </label>

              <button onClick={handleSubmit} style={styles.postBtn}>
                Post
              </button>
            </div>
          </div>
        </div>
     
        {/* POSTS LIST */}
        <div style={{ marginTop: "20px" }}>
          {posts && posts.length > 0 ? (
            posts.map((post) => {
          const postUser =
  post.userId && typeof post.userId === "object"
    ? post.userId
    : null;
    const authFromStorage =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

const loggedInUserId =
  user?._id ||
  user?.id ||
  authFromStorage?.user?._id ||
  authFromStorage?.user?.id ||
  null;



              return (
                <div key={post._id} style={styles.postCard}>
                  {/* POST HEADER */}
                  <div style={styles.postHeader}>
                    <img
                      src={
                        postUser?.ProfileImage
                          ? postUser.ProfileImage.startsWith("http")
                            ? postUser.ProfileImage
                            : `${BACKEND_URL}${postUser.ProfileImage}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              postUser?.Name || "User"
                            )}&background=random&color=fff&size=128`
                      }
                      alt="profile"
                      style={styles.postAvatar}
                    />
                    <div style={styles.userInfo}>
                     <span>{postUser?.Name || user?.Name}</span>
<span>{postUser?.Email || user?.Email}</span>

                     </div>
                  </div>
              

{postUser &&
  String(postUser._id) === String(loggedInUserId) && (
    <button
      style={styles.deleteBtn}
      onClick={() => handleDelete(post._id)}
    >
      <FaTrashAlt />
    </button>
)}
{/* this for coomend button stupl app */}

{activeCommentPost === post._id && (
  <div style={styles.commentPanel}>
    {/* Comment list */}
    <div style={styles.commentList}>
      {(comments[post._id] || []).map((c) => (
        <div key={c._id} style={styles.commentRow}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              c.userId?.Name || "User"
            )}&background=random&color=fff&size=64`}
            alt="avatar"
            style={styles.commentAvatar}
          />

          <div style={styles.commentBubble}>
            <span style={styles.commentName}>
              {c.userId?.Name}
            </span>
            <p style={styles.commentText}>{c.body}</p>
          </div>

          {String(c.userId?._id) === String(loggedInUserId) && (
            <FaTrashAlt
              style={styles.commentDelete}
              onClick={() =>
                handleDeleteComment(c._id, post._id)
              }
            />
          )}
        </div>
      ))}
    </div>

    {/* Input */}
    <div style={styles.commentBox}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        style={styles.commentInput}
      />
      <button
        style={styles.commentSendBtn}
        onClick={() => {
          handleSendComment(post._id);
          setTimeout(() => fetchComments(post._id), 300);
        }}
      >
        Send
      </button>
    </div>
  </div>
)}


                  {/* POST BODY */}
                  {post.body && <p style={styles.body}>{post.body}</p>}

                  {/* POST MEDIA */}
                  {post.media &&
                    post.media.length > 0 &&
                    post.media
                      .filter((m) => m.fileType === "image")
                      .map((file, index) => {
                        if (!file?.url) return null;
                        const src = file.url.startsWith("http")
                          ? file.url
                          : `${BACKEND_URL}${file.url}`;
                        return (
                          <div  key={index} >
                          <img
                           
                            src={src}
                            alt="post media"
                            style={styles.postImage}
                          />
                            {/* ACTION ICONS */}
          <div style={styles.postActions}>



         <button
  style={styles.actionBtn}
  onClick={() => handleToggleLike(post._id)}
>
  <FaThumbsUp
    color={post.liked ? "blue" : "gray"}
  />
  <span style={{ marginLeft: 6 }}>
    {post.likesCount}
  </span>
</button>

           <button
  style={styles.actionBtn}
  onClick={() => {
  const isOpen = activeCommentPost === post._id;
  setActiveCommentPost(isOpen ? null : post._id);
  if (!isOpen) fetchComments(post._id);
}}

>
  <FaCommentAlt /> Comment
</button>

        <button
  style={styles.actionBtn}
  onClick={() => handleNativeShare(post)}
>
  <FaShare /> Share
</button>



          </div>
        </div>
                        );
                      })}
                </div>
              );
            })
          ) : (
            <p>No posts yet...</p>
          )}
        </div>
      </DashboardContent>
    </Index>
    
  );
}
const styles = {
  // CREATE POST BOX
  createCard: {
  display: "flex",
  gap: "12px",
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",

  width: "100%",
  maxWidth: "600px",
  margin: "0 auto 20px",
},

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  userInfoBox: {
    marginBottom: "6px",
  },

  textarea: {
    width: "100%",
    minHeight: "60px",
    borderRadius: "8px",
    padding: "10px",
    border: "1px solid #ddd",
    resize: "none",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
  },

  addBtn: {
    cursor: "pointer",
    fontSize: "18px",
    color: "#0a66c2",
  },

  postBtn: {
    background: "#0a66c2",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "6px 18px",
    cursor: "pointer",
  },
 postCard: {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  position: "relative",

  width: "100%",
  maxWidth: "600px",
  margin: "0 auto 16px",
},



  postHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },

  postAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "12px",
    objectFit: "cover",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
  },

  name: {
    fontWeight: "600",
    fontSize: "15px",
    display: "block",
  },

  email: {
    fontSize: "13px",
    color: "#555",
  },

  body: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },

 postImage: {
  width: "100%",
  height: "auto",
  maxHeight: "400px",
  objectFit: "contain",   // ⭐ IMPORTANT
  borderRadius: "10px",
  marginTop: "8px",
  display: "block",
},

deleteBtn: {
  position: "absolute",
  top: "12px",
  right: "12px",
  border: "none",
  background: "transparent",
  color: "#e53935",
  cursor: "pointer",
  fontSize: "16px",
},
postActions: {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "8px",
  borderTop: "1px solid #eee",
  paddingTop: "6px",
},

actionBtn: {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "14px",
  color: "#555",
},
commentPanel: {
  marginTop: "12px",
  paddingTop: "10px",
  borderTop: "1px solid #eee",
},

commentList: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "10px",
},

commentRow: {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
},

commentAvatar: {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  objectFit: "cover",
},

commentBubble: {
  background: "#f1f3f6",
  borderRadius: "16px",
  padding: "10px 14px",
  maxWidth: "75%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
},

commentName: {
  fontSize: "13px",
  fontWeight: "600",
  display: "block",
  marginBottom: "2px",
},

commentText: {
  fontSize: "13px",
  margin: 0,
},

commentBox: {
  display: "flex",
  gap: "8px",
  alignItems: "center",
},

commentInput: {
  flex: 1,
  padding: "8px 14px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  background: "#f1f3f6",
  fontSize: "13px",
},

commentSendBtn: {
  background: "#0a66c2",
  color: "#fff",
  border: "none",
  borderRadius: "20px",
  padding: "6px 16px",
  cursor: "pointer",
  fontSize: "13px",
},

commentDelete: {
  color: "#999",
  cursor: "pointer",
  fontSize: "13px",
  marginTop: "8px",
},

};
