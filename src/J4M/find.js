import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./find.css"; // Đảm bảo import file CSS của bạn

const ITEMS_PER_PAGE = 40; // 4 items x 5 hàng

const Find = () => {
  const location = useLocation();
  const searchResults = location.state?.results || [];

  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán các sản phẩm trên trang hiện tại
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  // Chuyển sang trang tiếp theo
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Quay về trang trước
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Tổng số trang
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className="KQ">Kết quả tìm kiếm</h1>
      <h4 className="KQ">Tìm thấy <span style={{color:"red", padding:"0 5px"}}> {currentItems.length} </span> sản phẩm</h4>
      <div className="container">
        {currentItems.length > 0 ? (
          <>
            <div className="product-grid">
              {currentItems.map((product) => (
                <div key={product.productID} className="product">
                  <a href={`/detail/${product.productID}`}>
                    <img
                      style={{
                        height: "250px",
                        width: "250px",
                        objectFit: "cover",
                      }}
                      src={product.avatar}
                      alt={product.title}
                    />
                    <h3>{product.title}</h3>
                    <p style={{ color: "red" }}>{product.price} đ</p>
                  </a>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Trang trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </button>
            </div>
          </>
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default Find;
