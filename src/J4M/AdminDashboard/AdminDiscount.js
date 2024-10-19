import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [newDiscountPercent, setNewDiscountPercent] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [inputProductTypeId, setInputProductTypeId] = useState("");
  const [newStatus, setNewStatus] = useState("Enable");
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentDiscountID, setCurrentDiscountID] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/discount", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách khuyến mãi.");
        }

        const data = await response.json();
        setDiscounts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDiscounts();
  }, [accesstoken]);

  const handleCreate = async () => {
    try {
      if (!newDiscountPercent || !newStartDate || !newEndDate || !inputProductTypeId) {
        setError("Bạn phải nhập đầy đủ thông tin cho khuyến mãi.");
        return;
      }

      const body = {
        discountPercent: parseFloat(newDiscountPercent),
        startDate: newStartDate,
        endDate: newEndDate,
        status: newStatus,
        productTypeID: { productTypeID: parseInt(inputProductTypeId) }, // Assuming this is the correct structure
      };

      const response = await fetch("http://localhost:8080/api/v1/admin/discount", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const createdDiscount = await response.json();
        setDiscounts((prevDiscounts) => [...prevDiscounts, createdDiscount]);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Không thể tạo khuyến mãi.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async () => {
    try {
      if (!newDiscountPercent || !newStartDate || !newEndDate || !inputProductTypeId) {
        setError("Bạn phải nhập đầy đủ thông tin cho khuyến mãi.");
        return;
      }

      const body = {
        discountPercent: parseFloat(newDiscountPercent),
        startDate: newStartDate,
        endDate: newEndDate,
        status: newStatus,
        productTypeID: { productTypeID: parseInt(inputProductTypeId) }, // Assuming this is the correct structure
      };

      const response = await fetch(`http://localhost:8080/api/v1/admin/discount/${currentDiscountID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const updatedDiscount = await response.json();
        setDiscounts((prevDiscounts) =>
          prevDiscounts.map((discount) =>
            discount.discountID === currentDiscountID ? updatedDiscount : discount
          )
        );
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Không thể cập nhật khuyến mãi.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (discountID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/discount/${discountID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        credentials: "include",
      });
  
      if (response.ok) {
        setDiscounts((prevDiscounts) =>
          prevDiscounts.map((discount) =>
            discount.discountID === discountID ? { ...discount, status: 'Disabled' } : discount
          )
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Không thể vô hiệu hóa khuyến mãi.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (discount) => {
    setNewDiscountPercent(discount.discountPercent);
    setNewStartDate(discount.startDate);
    setNewEndDate(discount.endDate);
    setInputProductTypeId(discount.productTypeID?.productTypeID || ""); // Ensure to check for existence
    setNewStatus(discount.status);
    setCurrentDiscountID(discount.discountID);
    setEditMode(true);
  };

  const resetForm = () => {
    setNewDiscountPercent("");
    setNewStartDate("");
    setNewEndDate("");
    setInputProductTypeId("");
    setNewStatus("Enable");
    setEditMode(false);
    setCurrentDiscountID(null);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Quản Lý Khuyến Mãi</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>
      <h3>{editMode ? "Chỉnh Sửa Khuyến Mãi" : "Thêm Khuyến Mãi Mới"}</h3>
      <div>
        <label>Phần Trăm Khuyến Mãi: </label>
        <input
          type="number"
          value={newDiscountPercent}
          onChange={(e) => setNewDiscountPercent(e.target.value)}
        />
        <label>Bắt đầu: </label>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />
        <label>Kết thúc: </label>
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
        />
        {editMode && (
          <>
            <label>Product Type ID: </label>
            <input
              type="text"
              value={inputProductTypeId}
              onChange={(e) => setInputProductTypeId(e.target.value)}
              placeholder="Nhập ID Product Type..."
            />
          </>
        )}
        <label>Trạng Thái: </label>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="Enable">Enable</option>
          <option value="Disable">Disable</option>
        </select>
        <button onClick={editMode ? handleEdit : handleCreate}>
          {editMode ? "Cập Nhật" : "Thêm"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {discounts.length === 0 ? (
        <p>Không có khuyến mãi nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Khuyến Mãi</th>
              <th>Phần Trăm Khuyến Mãi</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.discountID}>
                <td>{discount.discountID}</td>
                <td>{discount.discountPercent}</td>
                <td>{new Date(discount.startDate).toLocaleDateString()}</td>
                <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                <td>{discount.status}</td>
                <td>
                  <button onClick={() => handleEditClick(discount)}>Chỉnh Sửa</button>
                  <button onClick={() => handleDelete(discount.discountID)}>Vô Hiệu Hóa</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDiscount;
