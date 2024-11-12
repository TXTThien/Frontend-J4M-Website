// src/Components/AdminBill.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import returnIcon from './ImageDashboard/return-button.png'; 
import { Chart, registerables } from 'chart.js'; 

Chart.register(...registerables);

const AdminBill = () => {
  const [bills, setBills] = useState([]);
  const [editingBillId, setEditingBillId] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/admin/bill",
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách hóa đơn.");
        }

        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBills();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/bill/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setBills((prevBills) =>
          prevBills.map((bill) =>
            bill.billID === id ? { ...bill, status: 'Disable' } : bill
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa hóa đơn.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (id, isPaid, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/bill/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isPaid: isPaid, status }),
        }
      );
  
      if (response.ok) {
        const updatedBill = await response.json();
        setBills(bills.map((bill) => (bill.billID === id ? updatedBill : bill)));
        setEditingBillId(null);
      } else {
        throw new Error("Không thể cập nhật hóa đơn.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateClick = (billId) => {
    setEditingBillId(billId);
  };

  const handleInputChange = (e, id, field) => {
    let value = e.target.value;
    if (field === "paid") {
      value = value === "1"; 
    }
    setBills(
      bills.map((bill) =>
        bill.billID === id ? { ...bill, [field]: value } : bill
      )
    );
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
          <h2>Quản Lý Hóa Đơn</h2>
      </div>
      {error && <p>{error}</p>}
      {bills.length === 0 ? (
        <p>Không có hóa đơn nào.</p>
      ) : (
        <>
          <table border="1" cellPadding="10" cellSpacing="0">
              <tr>
                <th>ID Hóa Đơn</th>
                <th>Ngày</th>
                <th>Đã thanh toán</th>
                <th>Trạng Thái</th>
                <th>Hành động</th>
              </tr>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.billID}>
                  <td>{bill.billID}</td>
                  <td>
                    {bill.date ? new Date(bill.date[0], bill.date[1] - 1, bill.date[2], bill.date[3], bill.date[4]).toLocaleDateString("en-GB") : ""}
                  </td>
                  <td>
                    {editingBillId === bill.billID ? (
                      <select
                        value={bill.paid ? "1" : "0"} 
                        onChange={(e) =>
                          handleInputChange(e, bill.billID, "paid")
                        }
                      >
                        <option value="1">Có</option>
                        <option value="0">Không</option>
                      </select>
                    ) : (
                      bill.paid ? "Có" : "Không"
                    )}
                  </td>
                  <td>
                    {editingBillId === bill.billID ? (
                      <select
                        value={bill.status}
                        onChange={(e) =>
                          handleInputChange(e, bill.billID, "status")
                        }
                      >
                        <option value="Enable">Enable</option>
                        <option value="Disable">Disable</option>
                      </select>
                    ) : (
                      bill.status
                    )}
                  </td>
                  <td>
                    {editingBillId === bill.billID ? (
                      <button
                        onClick={() =>
                          handleSave(bill.billID, bill.paid, bill.status)
                        }
                      >
                        Lưu
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleUpdateClick(bill.billID)}>
                          Chỉnh Sửa
                        </button>
                        <button onClick={() => handleDelete(bill.billID)}>
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminBill;
