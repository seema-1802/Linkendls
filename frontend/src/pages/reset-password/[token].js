import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BACKEND_URL } from "@/config";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
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

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/resetPassword/${token}`,
        {
          password,
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
  Create a new password for your account. Make sure it is strong and easy to remember.
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
    background: "#fff",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "30px",
    fontWeight: "700",
    color: "#222",
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
    marginBottom: "18px",
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