import axios from "axios";
import { useState } from "react";

const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({});
  const [error, setError] = useState("");
  const access_token = localStorage.getItem("access_token");
  const validatePassword = () => {
    let formErrors = {};
    if (passwordForm.newPassword.length < 8) {
      return (formErrors.currentPassword = "Mật khẩu phải có ít nhất 8 ký tự.");
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return (formErrors.confirmPassword =
        "Mật khẩu mới và xác nhận mật khẩu không trùng khớp.");
    }
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validatePassword();
    if (Object.keys(formErrors)?.length > 0) {
      setError(formErrors);
      return;
    }
    console.log("form", passwordForm);
    handleChangePassword();
    setError({});
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/account/changepassword",
        {},
        {
          params: {
            conpass: passwordForm.currentPassword,
            newpass: passwordForm.newPassword,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          // withCredentials: true,  // Include cookies in the request
        }
      );
    //   console.log("data of response: ", response.data);
        alert(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Error response: ");
        console.log("Respone data: ", error.response.data);
        setError({ message: error.response.data });
        console.log("Respone data: ", error.response.status);
        console.log("Respone data: ", error.response.headers);
      } else if (error.request) {
        console.log("Error request: ", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={
              passwordForm.currentPassword ? passwordForm.currentPassword : ""
            }
            onChange={handleChange}
            required
          />
          {error.currentPassword && (
            <p >{error.currentPassword}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword ? passwordForm.newPassword : ""}
            onChange={handleChange}
            required
          />
          {error.newPassword && (
            <p >{error.newPassword}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={
              passwordForm.confirmPassword ? passwordForm.confirmPassword : ""
            }
            onChange={handleChange}
            required
          />
          {error.confirmPassword && (
            <p >{error.confirmPassword}</p>
          )}
        </div>
        <button type="submit">Đổi mật khẩu</button>
        {error.message && (
          <p >{error.message}</p>
        )}
      </form>
    </>
  );
};
export default ChangePassword;
