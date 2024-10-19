// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
        username,
        password,
      });

      const { access_token, refresh_token, idAccount } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('accountID', idAccount);

      navigate('/dashboard');
    } catch (err) {
      setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      console.error(err);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Tên người dùng:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng Nhập</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div>
        <h3>Quên mật khẩu?</h3>
        <button onClick={handleForgotPassword}>Nhấn vào đây</button>
      </div>
      <div>
        <h3>Chưa có tài khoản?</h3>
        <button onClick={handleSignUp}>Đăng Ký</button>
      </div>
    </div>
  );
};

export default Login;
