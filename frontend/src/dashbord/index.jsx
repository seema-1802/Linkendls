// src/components/DashboardContent.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { FaUsers } from "react-icons/fa"; // 👥 People icon

const DashboardContent = ({ children }) => {
  const router = useRouter();

  //  get all users from redux or one single bhi la saka te hai
  const { users, loading } = useSelector((state) => state.auth);

  // screen width detect
  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

const renderUsers = () => (
  <>
    <h3 style={styles.rightTitle}>All Users</h3>
    {loading ? (
      <p>Loading users...</p>
    ) : users && users.length > 0 ? (
      users.map((user) => (
        <div key={user._id} style={styles.userCard}>
          <span style={styles.userName}>{user.Name}</span>
        </div>
      ))
    ) : (
      <p style={styles.empty}>No users found</p>
    )}
  </>
);

  return (
     <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column" : "row",
          padding: "0",
          gap: "0",
        }}
      >
      {/* LEFT SIDEBAR */}
      <div  style={{
            ...styles.sidebar,
            ...(isMobile ? styles.mobileSidebar : {}),
          }}>
        <AiFillHome
          style={styles.icon}
          onClick={() => router.push("/dashboard")}
          title="Home"
        />

        <FiSearch
          style={styles.icon}
          onClick={() => router.push("/discover")}
          title="Discover"
        />

        <FaUsers
          style={styles.icon}
          onClick={() => router.push("/connetion")}
          title="Connections"
        />
      </div>

    
      {/* <div style={styles.mainArea}>
       

        
        <div style={styles.contentWrapper}>
        
          <div style={styles.main}>{children}</div> */}


 {/* CENTER + RIGHT */}
        <div
           style={{
    ...styles.mainWrapper,
    flexDirection: isMobile ? "row" : "row",
    height: isMobile ? "calc(100vh - 60px)" : "auto",
  }}
        >
          {isMobile && (
    <div style={styles.mobileUsers}>
      {renderUsers()}
    </div>
  )}

  {/* MIDDLE */}
  <div style={{...styles.main,
     paddingBottom: isMobile ? "100px" : "20px",
  }}>{children}</div>

  {/* DESKTOP RIGHT USERS */}
  {!isMobile && (
    <div style={styles.right}>
      {renderUsers()}
    </div>
  )}
</div>


          {/* <div  style={{
              ...styles.right,
              width: isMobile ? "100%" : "280px",
              borderRadius: isMobile ? "0" : "10px",
            }}>
            

  <h3 style={styles.rightTitle}>All Users</h3>
             {loading ? (
              <p>Loading users...</p>
            ) :users && users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} style={styles.userCard}>
                    
                  <span style={styles.userName}>{user.Name}</span>
                </div>
              ))
            ) : (
              <p style={styles.empty}>No users found</p>
            )} */}
          </div>
        </div>
      
   
  );
};


const styles = {
 page: {
 
   flex: 1,                              // fill remaining height below nav
    minHeight: "calc(100vh - 60px)",      // remaining screen height
    width: "100%",  
  background: "#f3f2ef",
  display: "flex",
   flexDirection: "column",
     boxSizing: "border-box",
    overflowY: "auto", 
        padding: "0px",
},


  container: {
    display: "flex",
      flex: 1,
    width: "100%",
   // maxWidth: "1128px",
    height: "100%",
    boxSizing: "border-box",
      // padding: "10px", 
  },

  sidebar: {
    width: "70px",
    background: "#000",
    color: "#fff",
    borderRadius: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    gap: "30px",
  },

  mobileSidebar: {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "60px",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  borderRadius: "0",
  paddingTop: "0",
  background: "#000",   // important
  zIndex: 1000,         // important
},


  icon: {
    fontSize: "24px",
    cursor: "pointer",
  },

  mainWrapper: {
    flex: 1,
    display: "flex",
    gap: "2px",
      minHeight: 0,
  },

  main: {
    flex: 1,
    background: "#fff",
    borderRadius: "0",
    padding: "20px",
    border: "1px solid #e0e0e0",
    overflowY: "auto",
      minHeight: 0,
  },

  right: {
    width: "280px",
    background: "#fff",
    borderRadius: "0",
    padding: "16px",
    border: "1px solid #e0e0e0",
    overflowY: "auto",
  },

  userCard: {
    padding: "10px",
    marginBottom: "8px",
    background: "#f7f9fc",
    borderRadius: "8px",
    cursor: "pointer",
  },

  userName: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
  },

  empty: {
    fontSize: "14px",
    color: "#777",
  },

  rightTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    borderBottom: "1px solid #eee",
    paddingBottom: "6px",
  },

  mobileUsers: {
  width: "140px",
  background: "#fff",
  padding: "10px",
  borderRight: "1px solid #e0e0e0",
  overflowY: "auto",
},

};
export default DashboardContent;
