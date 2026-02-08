import DashboardContent from '@/dashbord'
import React, { useEffect } from "react";
import { useDispatch, useSelector, } from "react-redux";
import Index from '@/layout/UserLayout'
import { getAllUsers } from '@/config/redux/action/authAction';
import { useRouter } from "next/router";
import {  BACKEND_URL } from '@/config';
function Discover() {
    const dispatch = useDispatch();
      const router = useRouter();
  const { users, loading, error } = useSelector((state) => state.auth);


const [isDesktop, setIsDesktop] = React.useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsDesktop(window.innerWidth >= 1024);
  };
  checkScreen();
  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);



  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);



  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
     <Index>
   
   <DashboardContent>


        <h1>All Users</h1>
        <div style={{
            ...styles.userList,
    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
  }}>
          {users && users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} style={styles.outerCard}  onClick={() => router.push(`/view_profile/${user.Name}`)}

 onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
  }}

>
                {/* LEFT IMAGE BOX */}
                <div style={styles.imageBox}>
                  <img
                    src={
                      user.ProfileImage
                        ? user.ProfileImage.startsWith("http")
                          ? user.ProfileImage
                          : `${BACKEND_URL}${user.ProfileImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.Name || "User"
                          )}&background=random&color=fff&size=128`
                    }
                    alt={user.Name}
                    style={styles.avatar}
                  />
                </div>

                {/* RIGHT INFO BOX */}
                <div style={styles.infoBox}>
                  <div style={styles.nameBox}>
                    <span style={styles.name}>{user.Name}</span>
                  </div>
                  <div style={styles.emailBox}>
                    <span style={styles.email}>{user.Email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
    

   

   </DashboardContent>
    
    </Index>
  )
}
export default Discover


const styles = {
  userList: {
  display: "grid",
  gap: "16px",
  marginTop: "20px",
  width: "100%",
  maxWidth: "900px",   // ⭐ important
  marginLeft: "auto",
  marginRight: "auto",
  padding: "0 12px",
  gridTemplateColumns: "1fr",
},


  outerCard: {
  display: "flex",
  background: "#f7f7f7",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  gap: "12px",
  width: "100%",
   cursor: "pointer",
    transition: "all 0.2s ease",
},

  imageBox: {
    flexShrink: 0,
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    gap: "6px",
  },
  nameBox: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "6px 8px",
    background: "#fff",
  },
  emailBox: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "4px 8px",
    background: "#fff",
  },
  name: {
    fontWeight: "700",
    fontSize: "16px",
  },
  email: {
    fontSize: "14px",
    color: "#555",
  },
};