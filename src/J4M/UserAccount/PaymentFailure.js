import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
    const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate("/Prebuy"); 
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Thanh toán thất bại</h1>
      <p>Xin lỗi, đã xảy ra sự cố trong quá trình thanh toán. Vui lòng thử lại.</p>
      <button onClick={handleRetryPayment} style={{ marginTop: "20px" }}>
        Thử lại thanh toán
      </button>
    </div>
  );
};

export default PaymentFailure;
