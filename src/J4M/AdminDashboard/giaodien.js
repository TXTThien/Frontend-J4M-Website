import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Thêm file CSS cho Dashboard

const Dashboard = () => {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem('access_token');
  const accountID = localStorage.getItem('accountID');

  useEffect(() => {
    if (accountID && accesstoken) {
      fetch(`http://localhost:8080/api/v1/auth/account?accountID=${accountID}`, {
        headers: {
          'Authorization': `Bearer ${accesstoken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setAccountInfo(data);
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

  // Các hàm chuyển hướng
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-container">
        <div className="admin-buttons">
          <button onClick={() => handleNavigate('/AdminAccount')}>Quản lý Account</button>
          <button onClick={() => handleNavigate('/AdminBanner')}>Quản lý Banner</button>
          <button onClick={() => handleNavigate('/AdminBill')}>Quản lý hóa đơn</button>
          <button onClick={() => handleNavigate('/AdminBillInfo')}>Quản lý Bill Info</button>
          <button onClick={() => handleNavigate('/AdminBrand')}>Quản lý Brand</button>
          <button onClick={() => handleNavigate('/AdminCart')}>Quản lý Cart</button>
          <button onClick={() => handleNavigate('/AdminCategory')}>Quản lý Category</button>
          <button onClick={() => handleNavigate('/AdminDiscount')}>Quản lý Discount</button>
          <button onClick={() => handleNavigate('/AdminImage')}>Quản lý Image</button>
          <button onClick={() => handleNavigate('/AdminNews')}>Quản lý News</button>
          <button onClick={() => handleNavigate('/AdminOrigin')}>Quản lý Origin</button>
          <button onClick={() => handleNavigate('/AdminProduct')}>Quản lý Product</button>
          <button onClick={() => handleNavigate('/AdminProductSize')}>Quản lý ProductSize</button>
          <button onClick={() => handleNavigate('/AdminProductType')}>Quản lý ProductType</button>
          <button onClick={() => handleNavigate('/AdminReview')}>Quản lý Review</button>
          <button onClick={() => handleNavigate('/AdminSize')}>Quản lý Size</button>
        </div>
        <div className="account-info">
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
      </div>
    </div>
  );
};

export default Dashboard;
