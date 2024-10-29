import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import returnIcon from './ImageDashboard/return-button.png'; 

const AdminBanner = () => {
  const [bannerList, setBannerList] = useState([]);
  const [newBanner, setNewBanner] = useState({
    bannerImage: "",
    bannerType: "advertisement",
    productID: { productID: null },
    productTypeID: { productTypeID: null },
    categoryID: { categoryID: null },
    status: "Enable",
  });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [idType, setIdType] = useState("productID"); // Loại ID đang chọn
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/banner", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        setBannerList(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy banner:", err.message);
        setError(err.message);
      }
    };

    fetchBanners();
  }, [accesstoken]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8080/api/v1/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accesstoken}`,
            },
            credentials: "include",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            const imageUrl = data.DT; // Lưu đường dẫn ảnh
            setImageUrl(imageUrl); // Cập nhật đường dẫn ảnh vào state
            setNewBanner((prevBanner) => ({
                ...prevBanner,
                bannerImage: imageUrl, // Cập nhật đường link ảnh vào state newBanner
            }));
            console.log("Tải lên thành công:", imageUrl);
        } else {
            console.error("Lỗi khi tải lên:", data.EM);
        }
    } catch (err) {
        console.error("Lỗi khi tải lên:", err.message);
    }
};

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/banner/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setBannerList((prevBannerList) =>
          prevBannerList.map((banner) =>
            banner.bannerID === id ? { ...banner, status: 'Disable' } : banner
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa banner.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (id, bannerData) => {
    try {
      const bannerToUpdate = bannerList.find(banner => banner.bannerID === id);
  
      const updatedBannerData = {
        ...bannerToUpdate,
        ...bannerData,
        productID: bannerData.productID.productID ? { productID: bannerData.productID.productID } : null,
        productTypeID: bannerData.productTypeID.productTypeID ? { productTypeID: bannerData.productTypeID.productTypeID } : null,
        categoryID: bannerData.categoryID.categoryID ? { categoryID: bannerData.categoryID.categoryID } : null,
      };
  
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/banner/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedBannerData),
        }
      );
  
      if (response.ok) {
        const updatedBanner = await response.json();
        setBannerList((prevBannerList) =>
          prevBannerList.map((banner) =>
            banner.bannerID === id ? updatedBanner : banner
          )
        );
        setEditingBannerId(null);
      } else {
        throw new Error("Không thể cập nhật banner.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
        const { productID, productTypeID, categoryID } = newBanner;

        const filteredBanner = {
            bannerImage: newBanner.bannerImage, // Sử dụng bannerImage từ newBanner
            bannerType: newBanner.bannerType,
            status: newBanner.status,
            ...(productID.productID && { productID: { productID: productID.productID } }),
            ...(productTypeID.productTypeID && { productTypeID: { productTypeID: productTypeID.productTypeID } }),
            ...(categoryID.categoryID && { categoryID: { categoryID: categoryID.categoryID } }),
        };

        console.log("Dữ liệu banner đang gửi:", filteredBanner);

        const response = await fetch("http://localhost:8080/api/v1/admin/banner", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accesstoken}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(filteredBanner),
        });

        if (response.ok) {
            const createdBanner = await response.json();
            setBannerList([...bannerList, createdBanner]);
            setNewBanner({
                bannerImage: "",
                bannerType: "advertisement",
                productID: { productID: null },
                productTypeID: { productTypeID: null },
                categoryID: { categoryID: null },
                status: "Enable",
            });
            setIdType("productID");

        } else {
            throw new Error("Không thể tạo banner.");
        }
    } catch (err) {
        setError(err.message);
    }
};

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
<div className="admin-ql-container">

  <div className="title-container">
      <img 
        src={returnIcon} 
        alt="Quay Lại" 
        className="return-button" 
        onClick={handleBackToDashboard} 
      />
      <h2>Quản Lý Banner</h2>
    </div>

      <h3>Thêm Banner Mới</h3>
      <div>
      <label>Hình Ảnh Banner: </label>
      <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadImage}>Tải ảnh lên</button>
        {imageUrl && <img src={imageUrl} alt="Banner Avatar" style={{ width: 100 }} />}

        <label>Loại Banner: </label>
        <select
          value={newBanner.bannerType}
          onChange={(e) =>
            setNewBanner((prev) => ({ ...prev, bannerType: e.target.value }))
          }
        >
          <option value="advertisement">Advertisement</option>
          <option value="news">News</option>
          <option value="event">Event</option>
        </select>
        
        <label>Chọn ID:</label>
        <select
          value={idType}
          onChange={(e) => {
            setIdType(e.target.value);
            setNewBanner((prev) => ({
              ...prev,
              productID: { productID: null },
              productTypeID: { productTypeID: null },
              categoryID: { categoryID: null },
            }));
          }}
        >
          <option value="productID">Sản Phẩm</option>
          <option value="productTypeID">Loại Sản Phẩm</option>
          <option value="categoryID">Danh Mục</option>
        </select>

        {idType === "productID" && (
          <div>
            <label>ID Sản Phẩm: </label>
            <input
              type="number"
              value={newBanner.productID.productID || ""}
              onChange={(e) =>
                setNewBanner((prev) => ({
                  ...prev,
                  productID: { productID: e.target.value },
                }))
              }
            />
          </div>
        )}

        {idType === "productTypeID" && (
          <div>
            <label>ID Loại Sản Phẩm: </label>
            <input
              type="number"
              value={newBanner.productTypeID.productTypeID || ""}
              onChange={(e) =>
                setNewBanner((prev) => ({
                  ...prev,
                  productTypeID: { productTypeID: e.target.value },
                }))
              }
            />
          </div>
        )}

        {idType === "categoryID" && (
          <div>
            <label>ID Danh Mục: </label>
            <input
              type="number"
              value={newBanner.categoryID.categoryID || ""}
              onChange={(e) =>
                setNewBanner((prev) => ({
                  ...prev,
                  categoryID: { categoryID: e.target.value },
                }))
              }
            />
          </div>
        )}

        <label>Trạng thái: </label>
        <select
          value={newBanner.status}
          onChange={(e) =>
            setNewBanner((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="Enable">Enable</option>
          <option value="Disable">Disable</option>
        </select>
        
        <button onClick={handleCreate}>Thêm</button>
      </div>

      {error && <p>{error}</p>}
      {bannerList.length === 0 ? (
        <p>Không có banner nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Banner</th>
              <th>Hình Ảnh</th>
              <th>Loại Banner</th>
              <th>ID Sản Phẩm</th>
              <th>ID Loại Sản Phẩm</th>
              <th>ID Danh Mục</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {bannerList.map((banner) => (
              <tr key={banner.bannerID}>
                <td>{banner.bannerID}</td>
                <td>
                  <img src={banner.bannerImage} alt="Banner" style={{ width: "100px", height: "auto" }} />
                </td>
                <td>{banner.bannerType}</td>
                <td>{banner.productID?.productID || "N/A"}</td>
                <td>{banner.productTypeID?.productTypeID || "N/A"}</td>
                <td>{banner.categoryID?.categoryID || "N/A"}</td>
                <td>{banner.status}</td>
                <td>
                  {editingBannerId === banner.bannerID ? (
                    <>
                      <button onClick={() => handleSave(banner.bannerID, newBanner)}>Lưu</button>
                      <button onClick={() => setEditingBannerId(null)}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingBannerId(banner.bannerID);
                          setNewBanner({
                            bannerImage: banner.bannerImage,
                            bannerType: banner.bannerType,
                            productID: banner.productID || { productID: null },
                            productTypeID: banner.productTypeID || { productTypeID: null },
                            categoryID: banner.categoryID || { categoryID: null },
                            status: banner.status,
                          });
                        }}
                      >
                        Chỉnh Sửa
                      </button>
                      <button onClick={() => handleDelete(banner.bannerID)}>Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBanner;
