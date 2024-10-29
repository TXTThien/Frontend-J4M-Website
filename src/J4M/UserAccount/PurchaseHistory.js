import axios from "axios";
import { useEffect, useState } from "react";

const PurchaseHistory = () => {
  const access_token = localStorage.getItem("access_token");
  const [purchased, setPurchase] = useState({});
  const [billInfo, setBillInfo] = useState([
    // {
    //   title: "Product 1",
    //   price: 1000,
    //   number: 2,
    //   review: false,
    // },
    // {
    //   title: "Product 2",
    //   price: 2000,
    //   number: 1,
    //   review: {
    //     comment: "Good product!",
    //     rating: 4,
    //     .....
    //   },
    // },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [isAddReviewVisible, setAddReviewVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const getPurchaseHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/account/bought", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // withCredentials: true,  // Include cookies in the request
      });
      console.log("data of purchase history: ", response.data);
      setPurchase(response.data);
      const { billInfo, review } = response.data;
      console.log("billInfo: ", billInfo);
      console.log("review: ", review);
      const updatedBillInfo = billInfo.map((item) => {
        console.log("item id", item.productSizeID.productID.productID);
        const relatedReview = review.find(
          (rev) =>
            rev.productID.productID === item.productSizeID.productID.productID
        );

        return {
          title: item.productSizeID.productID.title,
          price: item.productSizeID.productID.price,
          number: item.number,
          review: relatedReview ? relatedReview : false,
        };
      });
      setBillInfo(updatedBillInfo);
    } catch (error) {
      if (error.response) {
        console.log("Error response: ");
        console.log("Respone data: ", error.response.data);
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

  const handleSubmitReview = async (comment,accountID) => {
    try {
      await axios.post(`http://localhost:8080/review`, {
        productId: selectedProductId,
        comment,
        accountID: accountID,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // Refresh purchase history after submitting review
      getPurchaseHistory();
      handleAddReviewClose();
    } catch (error) {
      console.log("Error submitting review: ", error);
    }
  };

  useEffect(() => {
    getPurchaseHistory();
    console.log(billInfo);
  }, []);

  const handleReviewClick = (item) => {
    setSelectedReview(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const handleAddReviewClick = (productId) => {
    setSelectedProductId(productId);
    setAddReviewVisible(true);
  };

  const handleAddReviewClose = () => {
    setAddReviewVisible(false);
    setSelectedProductId(null);
  };

  return (
    <div>
      <h2 style={{margin:'16px 8px'}}>Lịch sử mua hàng</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {billInfo.map((bill, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{bill.title}</td>
              <td>{bill.number}</td>
              <td>{bill.price}</td>
              <td>
                {bill.review ? (
                  <a style={{color: "blue", cursor: "pointer"}} onClick={() => handleReviewClick(bill.review.comment)}>
                    Xem
                  </a>
                ) : (
                  <a style={{color: "orange",cursor: "pointer"}} onClick={() => handleAddReviewClick(bill.productId)}>Đánh giá</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal hiển thị review */}
      <ModalReadReview
        isVisible={isModalVisible}
        onClose={handleModalClose}
        content={selectedReview}
      />
            {/* Modal thêm review */}
            <ModalAddReview
        isVisible={isAddReviewVisible}
        onClose={handleAddReviewClose}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};
export default PurchaseHistory;

const ModalReadReview = ({ isVisible, onClose, content }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Đánh giá sản phẩm</h3>
        <p>{content ? content : "Không có đánh giá nào."}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

const ModalAddReview = ({ isVisible, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment(''); // Reset form after submit
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Thêm đánh giá sản phẩm</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập đánh giá của bạn..."
        ></textarea>
        <button onClick={handleSubmit}>Gửi</button>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};
