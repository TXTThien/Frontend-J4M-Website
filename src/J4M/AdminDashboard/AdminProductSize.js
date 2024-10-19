import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductSize = () => {
  const [productSizes, setProductSizes] = useState([]);
  const [editingProductSizeId, setEditingProductSizeId] = useState(null);
  const [newProductSize, setNewProductSize] = useState({ productID: "", sizeID: "", stock: "", status: "Enable" });
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductSizes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/productsize", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách kích thước sản phẩm.");
        }

        const data = await response.json();
        setProductSizes(data.ProductSize); // Thay đổi theo cấu trúc dữ liệu trả về
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProductSizes();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/productsize/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        setProductSizes((prevProductSizes) =>
          prevProductSizes.map((size) =>
            size.productSizeID === id ? { ...size, status: "Disable" } : size
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa kích thước sản phẩm.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (id, stock, status) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/productsize/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ stock, status }),
      });

      if (response.ok) {
        const updatedProductSize = await response.json();
        setProductSizes((prevProductSizes) =>
          prevProductSizes.map((size) =>
            size.productSizeID === id ? updatedProductSize : size
          )
        );
        setEditingProductSizeId(null);
      } else {
        throw new Error("Không thể cập nhật kích thước sản phẩm.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    // Kiểm tra các trường nhập
    if (!newProductSize.productID || !newProductSize.sizeID || !newProductSize.stock) {
      setError("Vui lòng điền đủ các trường cần thiết.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/productsize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newProductSize),
      });

      if (response.ok) {
        const createdProductSize = await response.json();
        setProductSizes([...productSizes, createdProductSize]);
        setNewProductSize({ productID: "", sizeID: "", stock: "", status: "Enable" }); // Reset input fields
      } else {
        throw new Error("Không thể tạo kích thước sản phẩm.");
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
      <h2>Quản Lý Kích Thước Sản Phẩm</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>
      <h3>Thêm Kích Thước Sản Phẩm Mới</h3>
      <div>
        <label>ID Sản Phẩm: </label>
        <input
          type="text"
          value={newProductSize.productID}
          onChange={(e) => setNewProductSize({ ...newProductSize, productID: e.target.value })}
        />
        <label>Kích Thước ID: </label>
        <input
          type="text"
          value={newProductSize.sizeID}
          onChange={(e) => setNewProductSize({ ...newProductSize, sizeID: e.target.value })}
        />
        <label>Số lượng: </label>
        <input
          type="number"
          value={newProductSize.stock}
          onChange={(e) => setNewProductSize({ ...newProductSize, stock: e.target.value })}
        />
        <label>Trạng thái: </label>
        <select
          value={newProductSize.status}
          onChange={(e) => setNewProductSize({ ...newProductSize, status: e.target.value })}
        >
          <option value="Enable">Enable</option>
          <option value="Disable">Disable</option>
        </select>
        <button onClick={handleCreate}>Thêm</button>
      </div>

      {error && <p>{error}</p>}
      {productSizes.length === 0 ? (
        <p>Không có kích thước sản phẩm nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Kích Thước Sản Phẩm</th>
              <th>Sản Phẩm</th>
              <th>Kích Thước</th>
              <th>Tồn Kho</th>
              <th>Trạng Thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {productSizes.map((size) => (
              <tr key={size.productSizeID}>
                <td>{size.productSizeID}</td>
                <td>{size.productID.title}</td> {/* Thay đổi để hiển thị tên sản phẩm */}
                <td>{size.sizeID.sizeName}</td> {/* Thay đổi để hiển thị tên kích thước */}
                <td>
                  {editingProductSizeId === size.productSizeID ? (
                    <input
                      type="number"
                      value={size.stock}
                      onChange={(e) =>
                        setProductSizes((prevProductSizes) =>
                          prevProductSizes.map((s) =>
                            s.productSizeID === size.productSizeID
                              ? { ...s, stock: e.target.value }
                              : s
                          )
                        )
                      }
                    />
                  ) : (
                    size.stock
                  )}
                </td>
                <td>{size.status}</td>
                <td>
                  {editingProductSizeId === size.productSizeID ? (
                    <>
                      <button onClick={() => handleSave(size.productSizeID, size.stock, size.status)}>Lưu</button>
                      <button onClick={() => setEditingProductSizeId(null)}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingProductSizeId(size.productSizeID)}>Sửa</button>
                      <button onClick={() => handleDelete(size.productSizeID)}>Xóa</button>
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

export default AdminProductSize;
