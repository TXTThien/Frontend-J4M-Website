import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminBillInfo = () => {
  const [billInfos, setBillInfos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBillInfos = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/admin/billinfo",
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Cannot fetch bill information.");
        }

        const data = await response.json();
        setBillInfos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchBillInfos();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/billinfo/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        }
      );
  
      if (response.ok) {
        setBillInfos((prevBillInfos) =>
          prevBillInfos.map((billInfo) =>
            billInfo.billInfoID === id ? { ...billInfo, status: 'Disable' } : billInfo
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa thông tin hóa đơn.");
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
      <h2>Danh Sách Thông Tin Hóa Đơn</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>
      {loading && <p>Đang tải thông tin hóa đơn...</p>} {/* Loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {billInfos.length === 0 && !loading ? ( // Check loading state
        <p>Không có thông tin hóa đơn nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Thông Tin Hóa Đơn</th>
              <th>Số Hóa Đơn</th>
              <th>Trạng Thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {billInfos.map((billInfo) => (
              <tr key={billInfo.billInfoID}>
                <td>{billInfo.billInfoID}</td>
                <td>{billInfo.number}</td>
                <td>{billInfo.status}</td>
                <td>
                  <button onClick={() => handleDelete(billInfo.billInfoID)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBillInfo;