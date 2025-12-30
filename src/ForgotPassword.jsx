import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // step 1 = send code, step 2 = reset password
  const [message, setMessage] = useState("");

  const sendCode = async () => {
    try {
      const res = await axios.post("http://localhost:8081/api/users/forgot-password/send-code", { email });
      if (res.data === "code sent") {
        setMessage("✅ Code sent to your email!");
        setStep(2); // move to next step
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Email not found!");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post("http://localhost:8081/api/users/forgot-password/verify-code", {
        email,
        code,
        password: newPassword,
      });

      if (res.data === "updated") {
        alert("✅ Password reset successfully!");
        window.location.href = "/login";
      } else {
        setMessage("❌ Invalid code or email!");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Error resetting password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Forgot Password</h2>

          {step === 1 && (
            <>
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="auth-btn" onClick={sendCode}>Send Verification Code</button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="auth-label">Verification Code</label>
              <input
                className="auth-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <label className="auth-label">New Password</label>
              <input
                className="auth-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button className="auth-btn" onClick={resetPassword}>Reset Password</button>
            </>
          )}

          {message && <p className="auth-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
