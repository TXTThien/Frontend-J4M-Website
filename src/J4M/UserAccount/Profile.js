import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userImg from "./Image/user.png";
import phonenumberImg from "./Image/telephone.png";
import emailImg from "./Image/mail.png";
import addressImg from "./Image/location.png";
import nameImg from "./Image/id-card.png";
import roleImg from "./Image/group-chat.png";
const Profile = () => {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({});
  const [error, setError] = useState({});
  const [isEditable, SetIsEditable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleEdit = () => {
    SetIsEditable(!isEditable);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formError = validate();

    if (Object.keys(formError).length > 0) {
      setError(formError);
      return;
    }

    updateAccount();

    SetIsEditable(!isEditable);
    console.log("profile form data: ", JSON.stringify(profileForm));
    setError({});
  };

  const validate = () => {
    let formError = {};

    if (!profileForm.name) {
      formError.name = "Vui lòng nhập họ tên!";
    }

    if (!profileForm.email) {
      formError.email = "Vui lòng nhập email!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      formError.email = "Email không hợp lệ!";
    }

    if (!profileForm.phonenumber) {
      formError.phonenumber = "Vui lòng nhập số điện thoại!";
    } else if (
      profileForm.phonenumber.length !== 10 ||
      !/^(0)+([0-9]{9})$/.test(profileForm.phonenumber)
    ) {
      formError.phonenumber = "Số điện thoại không hợp lệ!";
    }

    if (!profileForm.address) {
      formError.address = "Vui lòng nhập địa chỉ!";
    }
    return formError;
  };

  const accountID = localStorage.getItem("accountID")
  const access_token = localStorage.getItem("access_token");


  // JWT decoding function to get payload
  const getDecodedToken = (access_token) => {
    try {
      const base64Url = access_token.split(".")[1]; // take payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload); // return JSON object
    } catch (error) {
      console.error("Invalid access_token", error);
      return null;
    }
  };



  const getUserInfor = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/auth/account",
        {
          params: {
            accountID: accountID,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          // withCredentials: true,  // Include cookies in the request

        }
      );
      console.log("data of user infor: ", response.data);
      setProfileForm(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Error response: ");
        console.log("Respone data: ",error.response.data);
        console.log("Respone data: ", error.response.status);
        console.log("Respone data: ", error.response.headers);
      } else if (error.request) {
        console.log("Error request: ",error.request);
      } else {
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);
    }
  };

  useEffect(() => {
    if(accountID && access_token) {
      getUserInfor();
    } else {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  },[]);
  const payload = getDecodedToken(access_token); //payload: {sub: 'txtt1103', iat: 1729597471, exp: 1729683871}
  const updateAccount = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/account/updateinfo",
        {
          name: profileForm.name,
          email: profileForm.email,
          phonenumber: profileForm.phonenumber,
          address: profileForm.address,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          // withCredentials: true,  // Optional: Use this if your API requires sending cookies
        }
      );
      console.log("data of user infor after update: ", response.data);
      alert(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Error response: ");
        console.log("Respone data: ",error.response.data);
        console.log("Respone data: ", error.response.status);
        console.log("Respone data: ", error.response.headers);
      } else if (error.request) {
        console.log("Error request: ",error.request);
      } else {
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);
    }
  }
    return (
      <>
        <div>
          <button onClick={() => navigate(-1)}>Quay lại</button>
          <h2>Thông tin cá nhân</h2>
        </div>
        <div>
          <div>
            <img src={userImg} alt="user" />
            <h2>
              {payload?.sub} <span>#{profileForm.id}</span>
            </h2>
            <p>{profileForm.email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <section>
              <div>
                <div>
                  <img src={nameImg} alt="name" />
                </div>
                <div>
                  <label htmlFor="name">Họ tên</label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={profileForm.name}
                    name="name"
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                  {error.name && <span>{error.name}</span>}
                </div>
              </div>

              <div>
                <div>
                  <img src={emailImg} alt="email" />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={profileForm.email}
                    name="email"
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                  {error.email && <span>{error.email}</span>}
                </div>
              </div>
            </section>

            <section>
              <div>
                <div>
                  <img src={phonenumberImg} alt="phone number" />
                </div>
                <div>
                  <label htmlFor="phonenumber">Số điện thoại</label>
                  <input
                    id="phonenumber"
                    type="tel"
                    defaultValue={profileForm.phonenumber}
                    name="phonenumber"
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                  {error.phonenumber && <span>{error.phonenumber}</span>}
                </div>
              </div>

              <div>
                <div>
                  <img src={addressImg} alt="address" />
                </div>
                <div>
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    id="address"
                    type="text"
                    defaultValue={profileForm.address}
                    name="address"
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                  {error.address && <span>{error.address}</span>}
                </div>
              </div>

              <div>
                <div>
                  <img src={roleImg} alt="role" />
                </div>
                <div>
                  <label htmlFor="role">Thành viên</label>
                  <input
                    id="role"
                    type="text"
                    defaultValue={profileForm.role}
                    name="role"
                    disabled
                  />
                </div>
              </div>
            </section>

            <div>
              {!isEditable && (
                <button type="button" onClick={handleEdit}>
                  edit
                </button>
              )}
              {isEditable && <button type="submit">Lưu</button>}
            </div>
          </form>
        </div>
      </>
    );
  };
export default Profile;
