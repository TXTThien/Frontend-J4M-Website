import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminReview = () => {
  const [reviewList, setReviewList] = useState([]);
  const [newReview, setNewReview] = useState({
    comment: "",
    rating: null,
    status: "Enable",
    accountID: { accountID: "" }, // Đổi thành đối tượng với thuộc tính accountID
    productID: null, // Mặc định là null
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/admin/review",
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách đánh giá.");
        }

        const data = await response.json();
        setReviewList(data.Review || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReviews();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/review/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setReviewList((prevReviewList) =>
          prevReviewList.map((review) =>
            review.reviewID === id ? { ...review, status: 'Disable' } : review
          )
        );
      } else {
        throw new Error("Không thể vô hiệu hóa đánh giá.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (id, reviewData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/review/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(reviewData),
        }
      );

      if (response.ok) {
        const updatedReview = await response.json();
        setReviewList((prevReviewList) =>
          prevReviewList.map((review) =>
            review.reviewID === id ? updatedReview : review
          )
        );
        setEditingReviewId(null);
      } else {
        throw new Error("Không thể cập nhật đánh giá.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      // Chỉnh sửa cấu trúc dữ liệu để phù hợp với yêu cầu
      const reviewData = {
        comment: newReview.comment,
        rating: newReview.rating,
        status: newReview.status,
        accountID: {
          accountID: newReview.accountID.accountID, // Lấy giá trị từ đối tượng
        },
        productID: newReview.productID,
      };
  
      console.log("Dữ liệu sẽ được gửi:", JSON.stringify(reviewData, null, 2)); // In ra dữ liệu JSON
      const response = await fetch("http://localhost:8080/api/v1/admin/review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });
  
      if (response.ok) {
        const createdReview = await response.json();
        setReviewList([...reviewList, createdReview]);
        setNewReview({
          comment: "",
          rating: null,
          status: "Enable",
          accountID: { accountID: "" }, // Reset lại thành đối tượng
          productID: null,
        });
      } else {
        throw new Error("Không thể tạo đánh giá.");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const renderStars = (rating, onClick) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => onClick(i)}
          style={{ color: i <= rating ? 'gold' : 'lightgray', cursor: 'pointer' }}
        >
          ★
        </span>
      );
    }
    return <div>{stars}</div>;
  };

  return (
    <div>
      <h2>Quản Lý Đánh Giá</h2>
      <button onClick={handleBackToDashboard}>Quay Lại</button>

      <h3>Thêm Đánh Giá Mới</h3>
      <div>
        <label>Bình luận: </label>
        <input
          value={newReview.comment}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, comment: e.target.value }))
          }
        />
        <label>ID Tài Khoản: </label>
        <input
          type="number"
          value={newReview.accountID.accountID} // Sử dụng accountID từ đối tượng
          onChange={(e) =>
            setNewReview((prev) => ({
              ...prev,
              accountID: { accountID: e.target.value }, // Đặt giá trị vào đối tượng
            }))
          }
        />
        <label>Đánh Giá: </label>
        {renderStars(newReview.rating || 0, (rating) =>
          setNewReview((prev) => ({ ...prev, rating }))
        )}
        <label>Trạng thái: </label>
        <select
          value={newReview.status}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="Enable">Enable</option>
          <option value="Disable">Disable</option>
        </select>
        <button onClick={handleCreate}>Thêm</button>
      </div>

      {error && <p>{error}</p>}
      {reviewList.length === 0 ? (
        <p>Không có đánh giá nào.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID Đánh Giá</th>
              <th>ID Tài Khoản</th>
              <th>Tên Tài Khoản</th>
              <th>Bình luận</th>
              <th>Đánh Giá</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {reviewList.map((review) => (
              <tr key={review.reviewID}>
                <td>{review.reviewID}</td>
                <td>
                  {editingReviewId === review.reviewID ? (
                    <input
                      type="number"
                      value={review.accountID.accountID} 
                      onChange={(e) =>
                        setReviewList((prevReviewList) =>
                          prevReviewList.map((r) =>
                            r.reviewID === review.reviewID
                              ? { ...r, accountID: { accountID: e.target.value } }
                              : r
                          )
                        )
                      }
                    />
                  ) : (
                    review.accountID.accountID
                  )}
                </td>
                <td>{review.accountID.name}</td>
                <td>
                  {editingReviewId === review.reviewID ? (
                    <input
                      value={review.comment}
                      onChange={(e) =>
                        setReviewList((prevReviewList) =>
                          prevReviewList.map((r) =>
                            r.reviewID === review.reviewID
                              ? { ...r, comment: e.target.value }
                              : r
                          )
                        )
                      }
                    />
                  ) : (
                    review.comment
                  )}
                </td>
                <td>
                  {editingReviewId === review.reviewID ? (
                    renderStars(review.rating || 0, (rating) =>
                      setReviewList((prevReviewList) =>
                        prevReviewList.map((r) =>
                          r.reviewID === review.reviewID
                            ? { ...r, rating }
                            : r
                        )
                      )
                    )
                  ) : (
                    renderStars(review.rating)
                  )}
                </td>
                <td>
                  {editingReviewId === review.reviewID ? (
                    <select
                      value={review.status}
                      onChange={(e) =>
                        setReviewList((prevReviewList) =>
                          prevReviewList.map((r) =>
                            r.reviewID === review.reviewID
                              ? { ...r, status: e.target.value }
                              : r
                          )
                        )
                      }
                    >
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </select>
                  ) : (
                    review.status
                  )}
                </td>
                <td>
                  {editingReviewId === review.reviewID ? (
                    <button
                      onClick={() => {
                        handleSave(review.reviewID, review);
                      }}
                    >
                      Lưu
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setEditingReviewId(review.reviewID)}>
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(review.reviewID)}>
                        Xóa
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

export default AdminReview;
