import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/Prebuy"); 
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công.</p>
      <button onClick={handleBackToHome} style={{ marginTop: "20px" }}>
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default PaymentSuccess;
