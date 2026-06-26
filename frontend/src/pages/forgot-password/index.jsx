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
console.log("Token:", res.token);

const result = await router.push(`/reset-password/${res.token}`);

console.log("Router Result:", result);
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