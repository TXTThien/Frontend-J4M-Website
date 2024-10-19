import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminBanner = () => {
  const [bannerList, setBannerList] = useState([]);
  const [newBanner, setNewBanner] = useState({
    bannerID: "",
    bannerImage: "",
    bannerType: "advertisement", // Mặc định là advertisement
    productID: { productID: null },
    productTypeID: { productTypeID: null },
    categoryID: { categoryID: null },
    status: "Enable",
  });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

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
          const errorMessage = await response.text(); // Lấy thông điệp lỗi từ server
          throw new Error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        setBannerList(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy banner:", err.message); // Ghi lại thông điệp lỗi
        setError(err.message);
      }
    };

    fetchBanners();
  }, [accesstoken]);

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
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/banner/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bannerData),
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
      const response = await fetch("http://localhost:8080/api/v1/admin/banner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newBanner),
      });

      if (response.ok) {
        const createdBanner = await response.json();
        setBannerList([...bannerList, createdBanner]);
        setNewBanner({
          bannerID: "",
          bannerImage: "",
          bannerType: "advertisement", // Đặt lại về giá trị mặc định
          productID: { productID: null },
          productTypeID: { productTypeID: null },
          categoryID: { categoryID: null },
          status: "Enable",
        });
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
    <div>
      <h2>Quản Lý Banner</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>

      <h3>Thêm Banner Mới</h3>
      <div>
        <label>ID Banner: </label>
        <input
          type="number"
          value={newBanner.bannerID}
          onChange={(e) =>
            setNewBanner((prev) => ({ ...prev, bannerID: e.target.value }))
          }
        />
        <label>Hình Ảnh Banner: </label>
        <input
          value={newBanner.bannerImage}
          onChange={(e) =>
            setNewBanner((prev) => ({ ...prev, bannerImage: e.target.value }))
          }
        />
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
              <th>Hình Ảnh</th> {/* Hiển thị đường dẫn hình ảnh */}
              <th>Loại Banner</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {bannerList.map((banner) => (
              <tr key={banner.bannerID}>
                <td>{banner.bannerID}</td>
                <td>
                  {banner.bannerImage} {/* Hiển thị đường dẫn hình ảnh */}
                </td>
                <td>
                  {editingBannerId === banner.bannerID ? (
                    <input
                      value={banner.bannerType}
                      onChange={(e) =>
                        setBannerList((prevBannerList) =>
                          prevBannerList.map((b) =>
                            b.bannerID === banner.bannerID
                              ? { ...b, bannerType: e.target.value }
                              : b
                          )
                        )
                      }
                    />
                  ) : (
                    banner.bannerType
                  )}
                </td>
                <td>
                  {editingBannerId === banner.bannerID ? (
                    <select
                      value={banner.status}
                      onChange={(e) =>
                        setBannerList((prevBannerList) =>
                          prevBannerList.map((b) =>
                            b.bannerID === banner.bannerID
                              ? { ...b, status: e.target.value }
                              : b
                          )
                        )
                      }
                    >
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </select>
                  ) : (
                    banner.status
                  )}
                </td>
                <td>
                  {editingBannerId === banner.bannerID ? (
                    <>
                      <button
                        onClick={() =>
                          handleSave(banner.bannerID, {
                            bannerImage: banner.bannerImage,
                            bannerType: banner.bannerType,
                            status: banner.status,
                          })
                        }
                      >
                        Lưu
                      </button>
                      <button onClick={() => setEditingBannerId(null)}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleDelete(banner.bannerID)}>Xóa</button>
                      <button onClick={() => setEditingBannerId(banner.bannerID)}>
                        Chỉnh Sửa
                      </button>
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
