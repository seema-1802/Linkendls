import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clientServer, BACKEND_URL } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import Index from "@/layout/UserLayout";
import DashboardContent from "@/dashbord";
import {
  getMyConnectedRequests,
  sendConnectionRequest,
  getMyAcceptedConnections,
  getAllUsers,
  getUserProfile,
} from "@/config/redux/action/authAction";
import { getAllPostsAction } from "@/config/redux/action/postAction";
import { FaDownload } from "react-icons/fa";

function ViewProfile({ profile: ssrProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.post);
  const reduxProfile = useSelector((state) => state.user?.profile) || null;
  const activeProfile = reduxProfile || ssrProfile;

  const work = activeProfile?.work || [];

  const [userPosts, setUserPosts] = useState([]);
  const { connectionRequests = [], user: authUser } = useSelector(
    (state) => state.auth
  );
const [connectionStatus, setConnectionStatus] = useState("connect"); 
// values: "connect", "pending", "connected"
const acceptedConnections = useSelector((state) => state.auth.connections);
const pendingRequests = useSelector((state) => state.auth.connectionRequests);


const isConnectDisabled = !authUser?._id || !activeProfile?.userId?._id || connectionStatus !== "connect";
const isPending = pendingRequests.some(
  (c) =>
    ((c.userId._id === authUser._id && c.connectId._id === activeProfile.userId._id) ||
     (c.userId._id === activeProfile.userId._id && c.connectId._id === authUser._id)) &&
    c.status === "pending"
);


useEffect(() => {
  if (!authUser?._id || !activeProfile?.userId?._id) return;

  // check accepted connections
  const isConnected = acceptedConnections.some(
    (c) =>
     (c.userId._id === authUser._id &&
      c.connectId._id === activeProfile.userId._id) ||
    (c.userId._id === activeProfile.userId._id &&
      c.connectId._id === authUser._id) 
    );

  // check pending
  const isPending = pendingRequests.some(
    (c) =>
      c.userId._id === authUser._id &&
      c.connectId._id === activeProfile.userId._id &&
      c.status === "pending"
  );

  if (isConnected) setConnectionStatus("connected");
  else if (isPending) setConnectionStatus("pending");
  else setConnectionStatus("connect");
}, [authUser, activeProfile, pendingRequests, acceptedConnections]);
const handleConnect = async () => {
  if (!authUser?._id || !activeProfile?.userId?._id) {
    console.error("Cannot send request, missing userId or connectId");
    return;
  }

  const payload = {
    userId: authUser._id,
    connectId: activeProfile.userId._id,
  };

  

  const result = await dispatch(sendConnectionRequest(payload));

  if (result.meta.requestStatus === "fulfilled") {
    setConnectionStatus("pending"); // <-- set button to pending immediately
  } else if (result.meta.requestStatus === "rejected") {
    alert(result.payload); // <-- optional: show error
  }

  // refresh pending requests from server
  dispatch(getMyConnectedRequests(authUser._id));
};


useEffect(() => {
  if (authUser?._id) {
    dispatch(getMyAcceptedConnections(authUser._id));
    dispatch(getMyConnectedRequests(authUser._id));
  }
}, [authUser]);


  // Fetch posts
  const getUserPost = async () => {
    await dispatch(getAllPostsAction());
  };

  
  // Get all users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Filter posts by user
  useEffect(() => {
    if (!postReducer.posts || !router.query.name) return;

    const filtered = postReducer.posts.filter(
      (post) => post.userId?.Name === router.query.name
    );
    setUserPosts(filtered);
  }, [postReducer.posts, router.query.name]);

  // Fetch posts on client
  useEffect(() => {
    if (authUser?._id) getUserPost();
  }, [authUser]);

  const handleDownloadResume = () => {
    if (!activeProfile?.userId?._id) return;
    window.open(`${BACKEND_URL}/generateResume/${activeProfile.userId._id}`, "_blank");
  };



  // Fetch current user profile
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const userId = JSON.parse(auth)?.user?.id;
    if (userId) dispatch(getUserProfile(userId));
  }, [dispatch]);

  if (!activeProfile?.userId) return <p>User not found</p>;



const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


  
  return (
    <Index>
      <DashboardContent>
        <div 
  style={{
    padding: "20px",
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}
>
          {/* Profile Header */}
          <div  style={{
      display: "flex",
     
      alignItems: "center",
      gap: "20px",
    }}>
            <img
              src={
                activeProfile.userId.ProfileImage
                  ? activeProfile.userId.ProfileImage.startsWith("http")
                    ? activeProfile.userId.ProfileImage
                    : `${BACKEND_URL}${activeProfile.userId.ProfileImage}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeProfile.userId.Name || "User"
                    )}&background=random&color=fff&size=128`
              }
              alt={activeProfile.userId.Name}
              width={120}
               style={{ borderRadius: "8px" }}
            />
            <div>
              <h5 style={{ margin: 0 }}>UserName: {activeProfile.userId.Name}</h5>
              <p style={{ margin: 0, color: "#555" }}>Email: {activeProfile.userId.Email}</p>
            </div>
          </div>


  <div
    style={{
      display: "flex",
      
      gap: "10px",
      alignItems: "center",
    }}
  >
{ mounted && authUser?._id !== activeProfile.userId._id && (
<button
  onClick={handleConnect}
  disabled={isConnectDisabled}
  style={{
    padding: "8px 12px",
    background:
      connectionStatus === "connected"
        ? "#6c757d"
        : connectionStatus === "pending"
        ? "#ffc107"
        : "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor:
      connectionStatus === "connected" ? "not-allowed" : "pointer",
    marginLeft: "10px",
  }}
>
  {connectionStatus === "connected"
    ? "Connected"
    : connectionStatus === "pending"
    ? "Pending"
    : "Connect"}
</button>

  )}


      

              <button
                onClick={handleDownloadResume}
                style={{
                  padding: "8px 12px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Download Resume"
              >
                <FaDownload />
              </button>
            </div>
          
      
          {/* Work Experience */}
          <h3 style={{ marginTop: "30px" ,flex: 1}}>Work Experience</h3>
          {work.length > 0 ? (
            work.map((job, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                    maxWidth: "700px",
                  padding: "12px",
                  borderRadius: "6px",
                  marginTop: "15px",
                  background: "#f9f9f9",
                }}
              >
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Position:</strong> {job.position || "N/A"}
                </p>
                <p>
                  <strong>Currently Working:</strong>{" "}
                  <span style={{ color: job.currentlyWorking ? "green" : "red" }}>
                    {job.currentlyWorking ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p>No work information available</p>
          )}

   
          {/* User Posts */}
          <h3 style={{ marginTop: "40px",flex: 1 }}>Activity</h3>
          {userPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            userPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "6px",
                   width: "100%",          // make it fill parent
        maxWidth: "700px",       // prevent overflow on small screens
        boxSizing: "border-box",// include padding in width
        wordWrap: "break-word", // break long words
        overflowWrap: "break-word",
                }}
              >
                {post.media?.length > 0 && (
                  <img
                    src={`${BACKEND_URL}${post.media[0].url}`}
                    alt="post media"
                    style={{ width: "100%", maxWidth: "400px" }}
                  />
                )}
                <p>{post.body.replace(/"/g, "")}</p>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
          </div>
          
        
      </DashboardContent>
    </Index>
  );
}

export default ViewProfile;

export async function getServerSideProps(context) {
  const { name } = context.params;
  try {
    const response = await clientServer.get(`/user/getUserByName/${name}`);
    const data = response.data;

    return {
      props: {
        profile: data.profile || null,
      },
    };
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return {
      props: {
        profile: null,
      },
    };
  }
}
