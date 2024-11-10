import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem('access_token');
  const refreshtoken = localStorage.getItem('refresh_token');
  const accountID = localStorage.getItem('accountID');
  useEffect(() => {

    if (accountID && accesstoken) {
      // Gửi yêu cầu GET tới backend
      fetch(`http://localhost:8080/api/v1/auth/account?accountID=${accountID}`, {
        headers: {
          'Authorization': `Bearer ${accesstoken}` // Thêm token vào header nếu cần
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
  }, [accountID, accesstoken]);

  const handleLogout = () => {
    fetch('http://localhost:8080/api/v1/auth/logout', {
      method: 'GET',
      credentials: 'include' 
    })
    .then(response => {
      if (response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('accountID');
  
        navigate('/login');
      } else {
        throw new Error('Không thể đăng xuất');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  

  return (
    <div>
      <h2>Dashboard</h2>
      {accesstoken && accountInfo ? (
        <div>
          <p>ID Account: {accountInfo.id}</p>
          <p>Tên: {accountInfo.name}</p>
          <p>Role: {accountInfo.role}</p>
          <p>Address: {accountInfo.address}</p>
          <p>Phone: {accountInfo.phonenumber}</p>
          <p>Email: {accountInfo.email}</p>
        </div>
      ) : (
        <p>Đang tải thông tin tài khoản...</p>
      )}
      {error && <p>{error}</p>}
      {!accesstoken && <p>Không có thông tin đăng nhập.</p>}

      {accesstoken && (
        <button onClick={handleLogout}>Đăng xuất</button>
      )}
    </div>
  );
};

export default Dashboard;
