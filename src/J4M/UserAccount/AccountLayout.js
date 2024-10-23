import { Outlet, useNavigate } from "react-router-dom";
import "./Accounct.css";
const AccountLayout = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Account Layout</h1>
      <div>
        <button onClick={() => navigate("/account/profile")}>Tài khoản</button>
        <button onClick={() => navigate("/account/orders")}>Đơn hàng</button>
        <button onClick={() => navigate("/account/changepassword")}>
          Đổi mật khẩu
        </button>
      </div>
      <Outlet />
    </div>
  );
};
export default AccountLayout;
