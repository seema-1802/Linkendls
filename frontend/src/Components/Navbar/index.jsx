import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { logout } from "../../config/redux/reducer/authReducer";
import styles from "./Navbar.module.css"; // import CSS module
function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();



  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
const handleLogout = () => {
  if (!dispatch || !logout) return; // prevent undefined
  try {
    dispatch(logout());
    router.push("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  return (
     <nav className={styles.nav}>
      {/* LEFT */}
      <Link href="/" className={styles.logo}>
        Pro Cor
      </Link>

      {/* RIGHT */}
      {isAuthenticated && user ? (
        <div className={styles.rightBox}>
          {/* PROFILE */}
          <Link href="/profile" className={styles.profile}>
           
            
             <span>{user?.Name}</span>
            
  <p 
  
   className={styles.profileName}
  onClick={() => { router.push("/profile") }}> profile</p>
    
          </Link>

          {/* LOGOUT */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login" className={styles.bePart}>
          Be Part
        </Link>
      )}
    </nav>
    );
}

export default Navbar;
