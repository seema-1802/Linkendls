import { useState } from "react";
import Swal from "sweetalert2";
  import { useDispatch } from "react-redux";
import { forgotPassword } from "@/redux/authThunk";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const dispatch = useDispatch();

const handleSubmit = async () => {
  if (!email) {
    Swal.fire("Error", "Please enter email", "error");
    return;
  }

   try {
  setLoading(true);

  const result = await dispatch(forgotPassword(email)).unwrap();

  await Swal.fire({
    icon: "success",
    title: "Success",
    text: result.message,
  });
console.log("Redirecting to:", result.resetUrl);
  window.location.href = result.resetUrl;

} catch (err) {
  console.log(err);
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