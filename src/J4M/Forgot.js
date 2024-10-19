import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Bắt đầu quá trình xử lý
    console.log(username);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/forgot-password",
        null,
        { params: { username } }
      );
      setSuccess("Mã OTP đã được gửi đến email của bạn!");
      setTimeout(() => {
        navigate("/verify-otp", { state: { username } });
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false); // Kết thúc quá trình xử lý
    }
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleForgotPassword}>
        <div>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
