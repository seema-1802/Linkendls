import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BACKEND_URL } from "@/config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Swal.fire("Error", "Please enter email", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/forgotPassword`,
        {
          email,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      console.log("Reset URL:", res.data.resetUrl);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "Failed to send reset link",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}