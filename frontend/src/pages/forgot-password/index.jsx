import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/config/redux/action/authAction";

export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    dispatch(forgotPassword(email));
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

      <button onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}