import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { logout } from "../../config/redux/reducer/authReducer";
import styles from "./Navbar.module.css";

function Navbar() {
  const [mounted, setMounted] = useState(false);

  const authState = useSelector((state) => state.auth || {});
  const user = authState.user;
  const isAuthenticated = authState.isAuthenticated;

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Pro Cor
      </Link>

      {isAuthenticated ? (
        <div className={styles.rightBox}>
          <Link href="/profile" className={styles.profile}>
            <span>{user?.Name}</span>
            <p className={styles.profileName}>profile</p>
          </Link>

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