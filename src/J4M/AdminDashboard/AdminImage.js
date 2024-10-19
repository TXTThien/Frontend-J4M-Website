import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminImage = () => {
  const [images, setImages] = useState([]);
  const [editingImageId, setEditingImageId] = useState(null);
  const [newImageURL, setNewImageURL] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/images", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách hình ảnh.");
        }

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImages();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.imageID === id ? { ...image, status: "Disable" } : image
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa hình ảnh.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (id, imageURL, productId, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/images/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ imageURL, product: { productID: productId }, status }),
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.imageID === id ? updatedImage : image
          )
        );
        setEditingImageId(null);
      } else {
        throw new Error("Không thể cập nhật hình ảnh.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ imageURL: newImageURL, product: { productID: selectedProductId }, status: "Enable" }),
      });

      if (response.ok) {
        const createdImage = await response.json();
        setImages([...images, createdImage]);
        setNewImageURL("");
        setSelectedProductId("");
      } else {
        throw new Error("Không thể tạo hình ảnh.");
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
      <h2>Quản Lý Hình Ảnh Sản Phẩm</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>
      <h3>Thêm Hình Ảnh Mới</h3>
      <div>
        <label>URL Hình Ảnh: </label>
        <input
          value={newImageURL}
          onChange={(e) => setNewImageURL(e.target.value)}
        />
        <label>Sản Phẩm ID: </label>
        <input
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        />
        <button onClick={handleCreate}>Thêm</button>
      </div>

      {error && <p>{error}</p>}
      {images.length === 0 ? (
        <p>Không có hình ảnh nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Hình Ảnh</th>
              <th>URL Hình Ảnh</th>
              <th>Sản Phẩm ID</th>
              <th>Trạng Thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.imageID}>
                <td>{image.imageID}</td>
                <td>
                  {editingImageId === image.imageID ? (
                    <input
                      value={image.imageURL}
                      onChange={(e) =>
                        setImages((prevImages) =>
                          prevImages.map((i) =>
                            i.imageID === image.imageID
                              ? { ...i, imageURL: e.target.value }
                              : i
                          )
                        )
                      }
                    />
                  ) : (
                    image.imageURL
                  )}
                </td>
                <td>{image.product.productID}</td>
                <td>{image.status}</td>
                <td>
                  {editingImageId === image.imageID ? (
                    <>
                      <button onClick={() => handleSave(image.imageID, image.imageURL, image.product.productID, image.status)}>Lưu</button>
                      <button onClick={() => setEditingImageId(null)}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingImageId(image.imageID)}>Sửa</button>
                      <button onClick={() => handleDelete(image.imageID)}>Xóa</button>
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

export default AdminImage;
