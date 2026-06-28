import { useState } from "react";
import Swal from "sweetalert2";
  import { useDispatch } from "react-redux";
import { forgotPassword } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const dispatch = useDispatch();

const router = useRouter();

const handleSubmit = async () => {
  if (!email) {
    Swal.fire("Error", "Please enter email", "error");
    return;
  }

  try {
    setLoading(true);

    const res = await dispatch(forgotPassword(email)).unwrap();

    Swal.fire({
      icon: "success",
      title: "Success",
      text: res.message,
    });

    setTimeout(() => {
     router.push(`/reset-password/${res.token}`);
    }, 1500);

  } catch (err) {
    Swal.fire("Error", err, "error");
  } finally {
    setLoading(false);
  }
 };

 return (
  <div style={styles.container}>
    <div style={styles.card}>
      <h1 style={styles.title}>Forgot Password</h1>

      <p style={styles.subtitle}>
        Enter your registered email address to receive a password reset link.
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  </div>
);
}
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #2563eb)",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px",
    lineHeight: "22px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
};