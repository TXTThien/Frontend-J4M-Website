// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Thêm file CSS cho Dashboard
import adminIcon from './ImageDashboard/admin.png'; // Đường dẫn đến icon admin
import accountIcon from './ImageDashboard/account.png'; // Hình ảnh cho quản lý account
import bannerIcon from './ImageDashboard/banner.png'; // Hình ảnh cho quản lý banner
import billIcon from './ImageDashboard/bill.png'; // Hình ảnh cho quản lý hóa đơn
import billInfoIcon from './ImageDashboard/billinfo.png'; // Hình ảnh cho quản lý Bill Info
import brandIcon from './ImageDashboard/brand.png'; // Hình ảnh cho quản lý Brand
import cartIcon from './ImageDashboard/cart.png'; // Hình ảnh cho quản lý Cart
import categoryIcon from './ImageDashboard/category.png'; // Hình ảnh cho quản lý Category
import discountIcon from './ImageDashboard/discount.png'; // Hình ảnh cho quản lý Discount
import imageIcon from './ImageDashboard/image.png'; // Hình ảnh cho quản lý Image
import newsIcon from './ImageDashboard/news.png'; // Hình ảnh cho quản lý News
import originIcon from './ImageDashboard/origin.png'; // Hình ảnh cho quản lý Origin
import productIcon from './ImageDashboard/product.png'; // Hình ảnh cho quản lý Product
import productSizeIcon from './ImageDashboard/productsize.png'; // Hình ảnh cho quản lý ProductSize
import productTypeIcon from './ImageDashboard/producttype.png'; // Hình ảnh cho quản lý ProductType
import reviewIcon from './ImageDashboard/review.png'; // Hình ảnh cho quản lý Review
import sizeIcon from './ImageDashboard/size.png'; // Hình ảnh cho quản lý Size

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
        if (data.role === 'admin') {
          setAccountInfo(data);
        } else {
          navigate('/error');
        }
      })
      .catch(error => {
        setError("Có lỗi xảy ra khi lấy thông tin tài khoản.");
        console.error(error);
      });
    } else {
      navigate('/login');
    }
  }, [accountID, accesstoken, navigate]);

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
      {/* Header */}
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <h1 className="shop-name">J4M</h1>
        <div className="admin-section">
          <img src={adminIcon} alt="Admin Icon" className="admin-icon" />
          <button className="logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      
      {/* Nội dung */}
      <div className="dashboard-container">
        <div className="admin-buttons-container">
          <div className="admin-buttons">
            <button onClick={() => handleNavigate('/AdminAccount')}>
              <img src={accountIcon} alt="Quản lý Account" /> Account
            </button>
            <button onClick={() => handleNavigate('/AdminBanner')}>
              <img src={bannerIcon} alt="Quản lý Banner" /> Banner
            </button>
            <button onClick={() => handleNavigate('/AdminBill')}>
              <img src={billIcon} alt="Quản lý hóa đơn" /> Bill
            </button>
            <button onClick={() => handleNavigate('/AdminBillInfo')}>
              <img src={billInfoIcon} alt="Quản lý Bill Info" /> Bill Info
            </button>
            <button onClick={() => handleNavigate('/AdminBrand')}>
              <img src={brandIcon} alt="Quản lý Brand" /> Brand
            </button>
            <button onClick={() => handleNavigate('/AdminCart')}>
              <img src={cartIcon} alt="Quản lý Cart" /> Cart
            </button>
            <button onClick={() => handleNavigate('/AdminCategory')}>
              <img src={categoryIcon} alt="Quản lý Category" /> Category
            </button>
            <button onClick={() => handleNavigate('/AdminDiscount')}>
              <img src={discountIcon} alt="Quản lý Discount" /> Discount
            </button>
            <button onClick={() => handleNavigate('/AdminImage')}>
              <img src={imageIcon} alt="Quản lý Image" /> Image
            </button>
            <button onClick={() => handleNavigate('/AdminNews')}>
              <img src={newsIcon} alt="Quản lý News" /> News
            </button>
            <button onClick={() => handleNavigate('/AdminOrigin')}>
              <img src={originIcon} alt="Quản lý Origin" /> Origin
            </button>
            <button onClick={() => handleNavigate('/AdminProduct')}>
              <img src={productIcon} alt="Quản lý Product" /> Product
            </button>
            <button onClick={() => handleNavigate('/AdminProductSize')}>
              <img src={productSizeIcon} alt="Quản lý ProductSize" /> Product Size
            </button>
            <button onClick={() => handleNavigate('/AdminProductType')}>
              <img src={productTypeIcon} alt="Quản lý ProductType" /> Product Type
            </button>
            <button onClick={() => handleNavigate('/AdminReview')}>
              <img src={reviewIcon} alt="Quản lý Review" /> Review
            </button>
            <button onClick={() => handleNavigate('/AdminSize')}>
              <img src={sizeIcon} alt="Quản lý Size" /> Size
            </button>
          </div>
        </div>
        <div className="account-info-container">
          <div className="account-info">
              <h3>Thông Tin Tài Khoản</h3>
              {accesstoken && accountInfo ? (
                  <div>
                      <div className="info-row">
                          <span className="label">ID Account:</span>
                          <span>{accountInfo.id}</span>
                      </div>
                      <div className="info-row">
                          <span className="label">Tên:</span>
                          <span>{accountInfo.name}</span>
                      </div>
                      <div className="info-row">
                          <span className="label">Role:</span>
                          <span>{accountInfo.role}</span>
                      </div>
                      <div className="info-row">
                          <span className="label">Address:</span>
                          <span>{accountInfo.address}</span>
                      </div>
                      <div className="info-row">
                          <span className="label">Phone:</span>
                          <span>{accountInfo.phonenumber}</span>
                      </div>
                      <div className="info-row">
                          <span className="label">Email:</span>
                          <span>{accountInfo.email}</span>
                      </div>
                  </div>
              ) : (
                  <p>Đang tải thông tin tài khoản...</p>
              )}
              {error && <p className="error">{error}</p>}
              {!accesstoken && <p>Không có thông tin đăng nhập.</p>}
          </div>
        </div>
      </div>
  </div>
  );
};

export default Dashboard;
