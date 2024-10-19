// src/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '', // Thêm confirmPassword vào form
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem password và confirmPassword có khớp nhau không
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
      console.log('User registered:', response.data);

      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Đăng Ký</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên người dùng:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        <div>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <div>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}
        </div>
        <div>
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
  );
};

export default SignUp;
