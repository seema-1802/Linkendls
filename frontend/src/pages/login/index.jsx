import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Index from "@/layout/UserLayout";
import styles from "./login.module.css";
import { getAllUsers } from "@/config/redux/action/authAction";
import { loginUser, registerUser,googleLoginUser } from "@/config/redux/action/authAction";
import { clearMessages } from "@/config/redux/reducer/authReducer";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../../config/firebase";
export default function AuthPage() {
    
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  
  const { isAuthenticated, loading, error, success , usersLoading,
  profileLoading} = useSelector(
    (state) => state.auth
  );
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",      //  to match backend
    Email: "",
    Password: "",
  });
const { users } = useSelector((state) => state.auth);
const currentUser = authState?.user?.user || authState?.user;
const userId = currentUser?.id;
useEffect(() => {
  
  if (!users?.length) {
    dispatch(getAllUsers());
  }
}, [dispatch, users]);
  // Redirect to dashboard after login/signup
  useEffect(() => {
  const currentUser = authState?.user?.user || authState?.user;

  if (isAuthenticated && currentUser?.id) {
    router.push("/dashboard");
  }
}, [isAuthenticated, authState?.user, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const payload = {
      email: result.user.email,
      name: result.user.displayName,
      googleId: result.user.uid,
    };

    const res = await dispatch(googleLoginUser(payload));

    if (googleLoginUser.fulfilled.match(res)) {
      router.push("/dashboard");
    }
  } catch (error) {
    console.log(error);
  }
};
const handleLogin = () => {
  dispatch(loginUser({
    Email: formData.Email,
    Password: formData.Password
  }));
};

  const handleSignup = async () => {
    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      // auto login after successful signup
      dispatch(
        loginUser({ Email: formData.Email, Password: formData.Password })
      );
    }
  };

  return (
    <>
    <Index>
      
      <div className={styles.page}>
        
        <div className={styles.card}>
          <div className={styles.left}>
            
            <h1>{isSignup ? "Sign Up" : "Login"}</h1>

            {isSignup && (
              <input
                type="text"
                name="Name" // PascalCase
                placeholder="Name"
                className={styles.input}
                onChange={handleChange}
              />
            )}
<input
  type="email"
  name="Email"
  placeholder="Email"
  className={styles.input}
   value={formData.Email || ""}         
  onChange={handleChange}
/>

<input
  type="password"
  name="Password"
  placeholder="Password"
  className={styles.input}
    value={formData.Password || ""}      
  onChange={handleChange}
/>


            <button
              className={styles.button}
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
            </button>
<div className={styles.divider}>
  <span>OR</span>
</div>

<button
  type="button"
  className={styles.googleBtn}
  onClick={handleGoogleLogin}
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
  />
  Continue with Google
</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
  {success && <p style={{ color: "green" }}>{success}</p>}
 
            <p
              style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
              onClick={() =>
                {
                    dispatch(clearMessages());
                  setIsSignup(!isSignup);}}
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </div>

          <div className={styles.right}>
            <h2>Welcome!</h2>
            
            <p>{isSignup ? "Create your account" : "Login to continue"}</p>
          
          </div>
        </div>
      </div>
    </Index>
     </>
  );
 
}
