// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './giaodien';
import Forgot from './Forgot';
import SignUp from './SignUp';
import VerifyOtp from './VerifyOtp';
import J4M from './j4m';
const sfa = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<J4M />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

      </Routes>
    </Router>
  );
};

export default sfa;
