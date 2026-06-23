import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BACKEND_URL } from "@/config";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Swal.fire(
        "Error",
        "Please fill all fields",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire(
        "Error",
        "Passwords do not match",
        "error"
      );
      return;
    }

    if (password.length < 6) {
      Swal.fire(
        "Error",
        "Password must be at least 6 characters",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/reset-password`,
        {
          token,
          Password: password,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "Reset password failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Reset Password
        </h1>

        <p style={styles.subtitle}>
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Updating..."
            : "Reset Password"}
        </button>

        <p
          style={styles.back}
          onClick={() => router.push("/login")}
        >
          Back to Login
        </p>
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
    background: "#f3f2ef",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#0a66c2",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#0a66c2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  back: {
    textAlign: "center",
    marginTop: "18px",
    color: "#0a66c2",
    cursor: "pointer",
    fontSize: "14px",
  },
};