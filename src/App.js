import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './J4M/login';
import Dashboard from './J4M/giaodien';
import Forgot from './J4M/Forgot';
import SignUp from './J4M/SignUp';
import VerifyOtp from './J4M/VerifyOtp';
import J4M from './J4M/j4m';
import AdminBill from './J4M/AdminBill';
import AdminBanner from './J4M/AdminBanner';
import AdminAccount from './J4M/AdminAccount';
import AdminBillInfo from './J4M/AdminBillInfo';
import AdminBrand from './J4M/AdminBrand';
import AdminCart from './J4M/AdminCart';
import AdminNews from './J4M/AdminNews';
import AdminOrigin from './J4M/AdminOrigin';
import AdminProduct from './J4M/AdminProduct';
import AdminReview from './J4M/AdminReview';
import AdminSize from './J4M/AdminSize';
import AdminCategory from './J4M/AdminCategory';
import AdminDiscount from './J4M/AdminDiscount';
import AdminImage from './J4M/AdminImage';
import AdminProductSize from './J4M/AdminProductSize';
import AdminProductType from './J4M/AdminProductType';





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<J4M />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/AdminBill" element={<AdminBill />} />
        <Route path="/AdminBanner" element={<AdminBanner />} />
        <Route path="/AdminAccount" element={<AdminAccount/>} />
        <Route path="/AdminBillInfo" element={<AdminBillInfo/>} />
        <Route path="/AdminBrand" element={<AdminBrand/>} />
        <Route path="/AdminCart" element={<AdminCart/>} />
        <Route path="/AdminNews" element={<AdminNews/>} />
        <Route path="/AdminOrigin" element={<AdminOrigin/>} />
        <Route path="/AdminProduct" element={<AdminProduct/>} />
        <Route path="/AdminReview" element={<AdminReview/>} />
        <Route path="/AdminSize" element={<AdminSize/>} />
        <Route path="/AdminCategory" element={<AdminCategory/>} />
        <Route path="/AdminDiscount" element={<AdminDiscount/>} />
        <Route path="/AdminImage" element={<AdminImage/>} />
        <Route path="/AdminProductSize" element={<AdminProductSize/>} />
        <Route path="/AdminProductType" element={<AdminProductType/>} />















      </Routes>
    </Router>
  );
};

export default App;
