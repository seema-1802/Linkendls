import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Index from "@/layout/UserLayout";
import DashboardContent from "@/dashbord";
import { BACKEND_URL } from "@/config";
import styles from "./profile.module.css";
import { getUserProfile, updateUserProfile ,updateProfileData ,getAllUsers} from "@/config/redux/action/authAction";
import { getAllPostsAction } from '@/config/redux/action/postAction';

function Profile() {
  const dispatch = useDispatch();

  const { user, profile, loading } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
const [localUserId, setLocalUserId] = useState(null);
const [isEditing, setIsEditing] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
const [form, setForm] = useState({
  Name: "",
  Email: "",
});
const [isWorkEditing, setIsWorkEditing] = useState(false);

const [workForm, setWorkForm] = useState({
  position: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
});

const handleWorkChange = (e) => {
  setWorkForm({
    ...workForm,
    [e.target.name]: e.target.value,
  });
};
const formatMonthYear = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
};


  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
useEffect(() => {
  if (user) {
    setForm({
      Name: user.Name || "",
      Email: user.Email || "",
    });
  }
}, [user]);

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const handleUpdate = () => {
  const formData = new FormData();
  formData.append("userId", localUserId);
  formData.append("Name", form.Name);
  formData.append("Email", form.Email);

  dispatch(updateUserProfile(formData));
};

const handleWorkUpdate = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;

  const data = {
    userId,
    work: [workForm], // backend expects work array
  };

  dispatch(updateProfileData(data));
  setIsWorkEditing(false);
};

useEffect(() => {
  setMounted(true);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const id = auth?.user?._id || auth?.user?.id;
  setLocalUserId(id);
}, []);
useEffect(() => {
  if (localUserId) {
    dispatch(getUserProfile(localUserId));
   
    dispatch(getAllPostsAction());
  }
}, [localUserId, dispatch]);


  useEffect(() => {
    if (!posts || !user?._id) return;

    const filtered = posts.filter(
      (post) => post.userId?._id === user._id
    );

    setUserPosts(filtered);
  }, [posts, user]);

  if (!mounted) return null;
  const handleImageChange =async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const auth = JSON.parse(localStorage.getItem("auth"));
  const userId = auth?.user?._id || auth?.user?.id;

  const formData = new FormData();
  formData.append("profileImage", file);
  formData.append("userId", userId);

  await dispatch(updateUserProfile(formData));

  dispatch(getUserProfile(userId)); // refresh data
};
  return (
    <Index>
      <DashboardContent>
        <div className={styles.profileHeader}>
  <div className={styles.cover}></div>
   <div className={styles.profileContent}>
          {loading && <p>Loading profile...</p>}

          {user && (
            <>
              {/* Header */}
<div className={styles.profileTop}>
            <div className={styles.avatarWrapper}>
  <img
    className={styles.avatar}
    src={
      user?.ProfileImage
        ? user.ProfileImage.startsWith("http")
          ? user.ProfileImage
          : `${BACKEND_URL}${user.ProfileImage}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.Name || "User"
          )}`
    }
    alt="profile"
    
  />

  <label className={styles.editIcon}>
    ✏️
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={handleImageChange}
    />
  </label>
</div>


 <div className={styles.basicInfo}>
  {!isEditing ? (
    <>
      <p><strong>Name:</strong> {user?.Name}</p>
      <p><strong>Email:</strong> {user?.Email}</p>

      <button
      className={styles.editBtn}
        onClick={() => setIsEditing(true)}
        
      >
        Edit
      </button>
    </>
  ) : (
     <div className={styles.editForm}>
      <input
        type="text"
        name="Name"
        value={form.Name}
        onChange={handleChange}
        placeholder="Your name"
       
      />

      <input
        type="email"
        name="Email"
        value={form.Email}
        onChange={handleChange}
        placeholder="Your email"
       
      />
 <div className={styles.formButtons}>
      <button
       className={styles.saveBtn}
        onClick={() => {
          handleUpdate();
          setIsEditing(false);
        }}
       
      >
        Save
      </button>

      <button
 className={styles.cancelBtn}
        onClick={() => setIsEditing(false)}
       
      >
        Cancel
      </button>
      </div>
    </div>
  )}
</div>
 </div>
 

              
{/* 🔹 Work Experience */}
<div style={{ marginTop: "30px" }}>
  <h3>Work Experience</h3>

  {!isWorkEditing ? (
    <>
      {profile?.work && profile.work.length > 0 ? (
        profile.work.map((job, index) => (
          <div
            key={index}
            className={styles.workCard}
          >
            <div className={styles.workDetails}>
        <p><strong>Position:</strong> {job.position}</p>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
    <p>
  <strong>Duration:</strong>{" "}
  {job.startDate
    ? `${formatMonthYear(job.startDate)} – ${
        job.endDate ? formatMonthYear(job.endDate) : "Present"
      }`
    : "Not specified"}
</p>


      </div>
    </div>
  ))
) : (
  <p className={styles.emptyText}>No work experience added.</p>
)}

      <button
        onClick={() => setIsWorkEditing(true)}
        style={{
          padding: "8px 16px",
          background: "#0a66c2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add / Edit Work
      </button>
    </>
  ) : (
    <>
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={workForm.position}
        onChange={handleWorkChange}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={workForm.company}
        onChange={handleWorkChange}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={workForm.location}
        onChange={handleWorkChange}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="date"
        name="startDate"
        value={workForm.startDate}
        onChange={handleWorkChange}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="date"
        name="endDate"
        value={workForm.endDate}
        onChange={handleWorkChange}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={handleWorkUpdate}
        style={{
          padding: "8px 16px",
          background: "#0a66c2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Save
      </button>

      <button
        onClick={() => setIsWorkEditing(false)}
        style={{
          padding: "8px 16px",
          background: "#ccc",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </>
  )}
</div>

           

              {/* 🔹 Posts Activity */}
              <div style={{ marginTop: "40px" }}>
                <h3>Activity</h3>

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
                         maxWidth: "700px",
                      }}
                    >
                    
                      {post.media?.length > 0 && (
                        <img
                          src={`${BACKEND_URL}${post.media[0].url}`}
                          alt="post media"
                          style={{
                            width: "100%",
                            maxWidth: "400px",
                          }}
                        />
                      )}


  <p>{post.body.replace(/"/g, "")}</p>

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        </div>
      </DashboardContent>
    </Index>
  );
}

export default Profile;
