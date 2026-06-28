import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/redux/authThunk";
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
      Swal.fire(
        "Error",
        err?.message || "Something went wrong",
        "error"
      );
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
    width: "400px",
    background: "#fff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px",
    lineHeight: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
};