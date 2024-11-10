import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./Component/Home/Home";
import Login from "./J4M/login";
import Dashboard from "./J4M//AdminDashboard/giaodien";
import Forgot from "./J4M/Forgot";
import SignUp from "./J4M/SignUp";
import VerifyOtp from "./J4M/VerifyOtp";
import J4M from "./J4M/j4m";
import AdminBill from "./J4M/AdminDashboard/AdminBill";
import AdminBanner from "./J4M/AdminDashboard/AdminBanner";
import AdminAccount from "./J4M/AdminDashboard/AdminAccount";
import AdminBillInfo from "./J4M/AdminDashboard/AdminBillInfo";
import AdminBrand from "./J4M/AdminDashboard/AdminBrand";
import AdminCart from "./J4M/AdminDashboard/AdminCart";
import AdminNews from "./J4M/AdminDashboard/AdminNews";
import AdminOrigin from "./J4M/AdminDashboard/AdminOrigin";
import AdminProduct from "./J4M/AdminDashboard/AdminProduct";
import AdminReview from "./J4M/AdminDashboard/AdminReview";
import AdminSize from "./J4M/AdminDashboard/AdminSize";
import AdminCategory from "./J4M/AdminDashboard/AdminCategory";
import AdminDiscount from "./J4M/AdminDashboard/AdminDiscount";
import AdminImage from "./J4M/AdminDashboard/AdminImage";
import AdminProductSize from "./J4M/AdminDashboard/AdminProductSize";
import AdminProductType from "./J4M/AdminDashboard/AdminProductType";
import AccountLayout from "./J4M/UserAccount/AccountLayout";
import Profile from "./J4M/UserAccount/Profile";
import ChangePassword from "./J4M/UserAccount/ChangePassword";
import PurchaseHistory from "./J4M/UserAccount/PurchaseHistory";
import Header from "./Component/Header/header";
import Footer from "./Component/Footer/footer";
import PreBuy from "./J4M/UserAccount/PreBuy";
import PaymentFailure from "./J4M/UserAccount/PaymentFailure";
import PaymentSuccess from "./J4M/UserAccount/PaymentSuccess";
import ProductDetail from "./J4M/ProductDetail";
import Find from "./J4M/find";
import NewsList from "./Component/News/NewsList";
import NewsDetail from "./Component/News/NewsDetail";
import ProductList from "./Component/ProductList/ProductList";
const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const expirationTime = 86400000;

    if (loginTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - loginTime;

      if (timeElapsed > expirationTime) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("accountID");
        localStorage.removeItem("loginTime");

        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<Find />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/preBuy" element={<PreBuy />} />
        <Route path="/AdminBill" element={<AdminBill />} />
        <Route path="/AdminBanner" element={<AdminBanner />} />
        <Route path="/AdminAccount" element={<AdminAccount />} />
        <Route path="/AdminBillInfo" element={<AdminBillInfo />} />
        <Route path="/AdminBrand" element={<AdminBrand />} />
        <Route path="/AdminCart" element={<AdminCart />} />
        <Route path="/AdminNews" element={<AdminNews />} />
        <Route path="/AdminOrigin" element={<AdminOrigin />} />
        <Route path="/AdminProduct" element={<AdminProduct />} />
        <Route path="/AdminReview" element={<AdminReview />} />
        <Route path="/AdminSize" element={<AdminSize />} />
        <Route path="/AdminCategory" element={<AdminCategory />} />
        <Route path="/AdminDiscount" element={<AdminDiscount />} />
        <Route path="/AdminImage" element={<AdminImage />} />
        <Route path="/AdminProductSize" element={<AdminProductSize />} />
        <Route path="/AdminProductType" element={<AdminProductType />} />
        <Route path="/PaymentFailure" element={<PaymentFailure />} />
        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Profile />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="orders" element={<PurchaseHistory />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
