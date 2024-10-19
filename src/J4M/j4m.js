import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const J4M = () => {
  const location = useLocation();
  const { access_token, refresh_token, idAccount } = location.state || {};
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idAccount && access_token) {
      fetch(`http://localhost:8080/api/v1/auth/account?accountID=${idAccount}`, {
        headers: {
          'Authorization': `Bearer ${access_token}` // Thêm token vào header nếu cần
        }
      })
      .then(response => response.json())
      .then(data => {
        setAccountInfo(data); // Lưu thông tin tài khoản vào state
      })
      .catch(error => {
        setError("Có lỗi xảy ra khi lấy thông tin tài khoản.");
        console.error(error);
      });
    }
  }, [idAccount, access_token]);

  return (
    <div>
      <h2>Dashboard</h2>
      </div>
  );
};

export default J4M;
