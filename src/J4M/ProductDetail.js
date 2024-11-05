import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "./ProductDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Grid from "@mui/material/Grid";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productBrand, setProductBrand] = useState(null);
  const [productSimilar, setProductSimilar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [avgScore, setAverageScore] = useState(0);
  const mainSliderRef = useRef(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/detail/${id}`);
        if (response.status === 200) {
          const {
            product,
            reviews,
            productSizes,
            imageList,
            productBrand,
            productSimilar,
          } = response.data;
          setProduct(product);
          setReviews(reviews);
          setProductSizes(productSizes);
          setImageList(imageList);
          setProductBrand(productBrand);
          setProductSimilar(productSimilar);

          const totalScore = reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const avgScore = reviews.length > 0 ? totalScore / reviews.length : 0;
          setAverageScore(avgScore);
        } else {
          setError("Product not available or disabled.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    setQuantity(1);
  }, [product]);
  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const productSizeID = productSizes[selectedSizeIndex].productSizeID;
      const response = await axios.post(
        "http://localhost:8080/addToPrebuy",
        {
          productSizeID: productSizeID,
          accountID: null,
          status: null,
          number: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/prebuy");
    } catch (error) {
      if (error.response) {
        console.error("Error adding to prebuy:", error.response.data);
      } else {
        console.error("Network or server error:", error.message);
      }
    }
  };
  const ModalSuccess = ({ isVisible, message, onClose }) => {
    if (!isVisible) {
      return null;
    }

    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h3>Thông báo</h3>
          <p>{message}</p>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    );
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const productSizeID = productSizes[selectedSizeIndex].productSizeID;
      const response = await axios.post(
        "http://localhost:8080/addToPrebuy",
        {
          productSizeID: productSizeID,
          accountID: null,
          status: null,
          number: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Hiển thị thông báo thành công
      setSuccessMessage("Sản phẩm đã được thêm vào giỏ hàng!");
      setSuccessModalVisible(true);

      // Có thể không cần điều hướng sau khi thêm vào giỏ hàng
    } catch (error) {
      if (error.response) {
        console.error("Error adding to cart:", error.response.data);
      } else {
        console.error("Network or server error:", error.message);
      }
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

  useEffect(() => {
    if (mainSliderRef.current) {
      if (!isZoomed) {
        mainSliderRef.current.slickPlay();
      } else {
        mainSliderRef.current.slickPause();
      }
    }
  }, [isZoomed]);

  useEffect(() => {
    const maxStock = productSizes[selectedSizeIndex]?.stock || 0;
    if (quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [selectedSizeIndex, productSizes]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    mainSliderRef.current.slickGoTo(index);
  };

  const handleSizeChange = (index) => {
    if (productSizes[selectedSizeIndex].stock === 0) setQuantity(1);
    setSelectedSizeIndex(index);
  };

  const handleImageClick = () => {
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  const maxStock = productSizes[selectedSizeIndex]?.stock || 0;

  const handleIncrease = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, maxStock));
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleChange = (e) => {
    const value = Math.min(Math.max(1, Number(e.target.value)), maxStock);
    setQuantity(value);
  };
  const toggleDetails = () => {
    setIsExpanded((prev) => !prev); // Đảo ngược trạng thái mở rộng
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !isZoomed,
    autoplaySpeed: 5000,
    dots: true,
    arrows: true,
    afterChange: (current) => setActiveIndex(current),
  };

  const thumbnailSliderSettings = {
    slidesToShow: imageList.length,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    dots: false,
    centerMode: false,
    infinite: false,
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="star full" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    return stars;
  };
  const commentStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="comment star full" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="comment star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="comment star empty" />);
      }
    }
    return stars;
  };
  return (
    <>
      <div className="container">
        <div className="menu">
          <ul id="main-menu">
            <li style={{ borderRight: "1px solid #7c7c7c71" }}>
              <Link to="/">Trang chủ</Link>
            </li>
            <li style={{ borderRight: "1px solid #7c7c7c71" }}>
              <Link to="/product">Danh mục sản phẩm</Link>
            </li>
            {product?.productType?.categoryID && (
              <li style={{ borderRight: "1px solid #7c7c7c71" }}>
                <Link
                  to={`/product/sort/?category=${product.productType.categoryID.categoryID}`}
                >
                  {product.productType.categoryID.categoryName}
                </Link>
              </li>
            )}
            {product?.productType && (
              <li style={{ borderRight: "1px solid #7c7c7c71" }}>
                <Link
                  to={`/product/sort/?producttype=${product.productType.productTypeID}`}
                >
                  {product.productType.typeName}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Grid container>
          <Grid item xs={6} className="col-6">
            <div className="product-container-gallery">
              <Slider
                {...mainSliderSettings}
                ref={mainSliderRef}
                className="productGallery_slider"
              >
                {imageList.map((image, index) => (
                  <div key={index} onClick={handleImageClick}>
                    <div
                      className="product-gallery"
                      data-image={image.imageURL}
                    >
                      <a className="product-gallery__item">
                        <img src={image.imageURL} alt={product.title} />
                      </a>
                    </div>
                  </div>
                ))}
              </Slider>

              <Slider
                {...thumbnailSliderSettings}
                className="productGallery_thumb"
              >
                {imageList.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <div
                      style={{ margin: "0 5px" }}
                      className="product-thumb"
                      data-image={image.imageURL}
                    >
                      <a className="product-thumb__item">
                        <img src={image.imageURL} alt={product.title} />
                      </a>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Grid>
          <Grid item xs={6} className="grid-col-6">
            <div className="infoProduct">
              <h1 className="titleProduct">{product?.title}</h1>
              <h6>
                <span>{avgScore.toFixed(1)}/5.0</span>{" "}
                <span className="star">★</span>
                <span className="reviewLength">{reviews.length} Đánh giá</span>
              </h6>
              <h2 className="productPrice">{product.price} đ</h2>
              <h3 className="Size">
                Size:
                <ul className="productSizes">
                  {productSizes.map((size, index) => (
                    <li
                      value={size.productSizeID}
                      key={index}
                      onClick={() => handleSizeChange(index)}
                      className={selectedSizeIndex === index ? "selected" : ""}
                    >
                      {size.sizeID.sizeName}
                    </li>
                  ))}
                </ul>
              </h3>
              <h4 className="Stock">
                {productSizes[selectedSizeIndex]?.stock > 0 ? (
                  <>Còn lại: {productSizes[selectedSizeIndex]?.stock || 0}</>
                ) : (
                  <span style={{ color: "red" }}>Sản phẩm tạm hết hàng</span>
                )}
              </h4>

              <div className="Number">
                <h4>Số lượng: </h4>
                <button
                  onClick={handleDecrease}
                  className={`decrease-btn ${
                    quantity >= maxStock ? "disabled" : ""
                  }`}
                  disabled={quantity >= maxStock}
                >
                  -
                </button>
                <input
                  className="numberInput"
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={handleChange}
                  onBlur={() => setQuantity(Math.min(quantity, maxStock))} // Điều chỉnh số lượng khi người dùng rời khỏi ô nhập
                />
                <button
                  onClick={handleIncrease}
                  className={`increase-btn ${
                    quantity >= maxStock ? "disabled" : ""
                  }`}
                  disabled={quantity >= maxStock}
                >
                  +
                </button>
              </div>

              <div className="buy">
                <button
                  className={`addToCart ${
                    productSizes[selectedSizeIndex]?.stock === 0
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={productSizes[selectedSizeIndex]?.stock === 0}
                >
                  <h4>Thêm vào giỏ hàng</h4>
                </button>
                <ModalSuccess
                  isVisible={isSuccessModalVisible}
                  message={successMessage}
                  onClose={handleSuccessModalClose}
                />
                <button
                  className={`buyNow ${
                    productSizes[selectedSizeIndex]?.stock === 0
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleBuyNow}
                  disabled={productSizes[selectedSizeIndex]?.stock === 0} // Disable khi hết hàng
                >
                  <h4>Mua ngay</h4>
                </button>
              </div>
            </div>
          </Grid>
        </Grid>
        {isZoomed && (
          <div className="zoom-overlay" onClick={handleCloseZoom}>
            <div className="zoomed-image-container">
              <button className="close-button" onClick={handleCloseZoom}>
                X
              </button>
              <img
                src={imageList[activeIndex].imageURL}
                alt={product.title}
                className="zoomed-image"
              />
            </div>
          </div>
        )}
      </div>

      <div className="container">
        <h1 className="detail">CHI TIẾT SẢN PHẨM</h1>

        <h6 className="productinfodetail">
          Danh mục:
          <h4>
            <ul className="infoDanhMuc">
              <li>
                <Link to="/">Trang chủ</Link>
                <img
                  src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/966fbe37fe1c72e3f2dd.svg"
                  alt="Arrow Icon"
                  className="icon-arrow"
                />
              </li>
              <li>
                <Link to="/product">Danh mục sản phẩm</Link>
                <img
                  src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/966fbe37fe1c72e3f2dd.svg"
                  alt="Arrow Icon"
                  className="icon-arrow"
                />
              </li>
              {product?.productType?.categoryID && (
                <li>
                  <Link
                    to={`/product/sort/?category=${product.productType.categoryID.categoryID}`}
                  >
                    {product.productType.categoryID.categoryName}
                  </Link>
                  <img
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/966fbe37fe1c72e3f2dd.svg"
                    alt="Arrow Icon"
                    className="icon-arrow"
                  />
                </li>
              )}
              {product?.productType && (
                <li>
                  <Link
                    to={`/product/sort/?producttype=${product.productType.productTypeID}`}
                  >
                    {product.productType.typeName}
                  </Link>
                </li>
              )}
            </ul>
          </h4>
        </h6>

        {isExpanded && ( // Hiển thị thông tin nếu isExpanded là true
          <>
            <h6 className="productinfodetail">
              Thương hiệu:
              <h4 className="infodetail">
                <Link
                  to={`/product/sort/?brand=${product.brandID.brandID}`}
                  className="linkTo"
                >
                  {product.brandID.brandName}
                </Link>
              </h4>
            </h6>
            <h6 className="productinfodetail">
              Xuất xứ:
              <h4 className="infodetail">
                <Link
                  to={`/product/sort/?origin=${product.originID.originID}`}
                  className="linkTo"
                >
                  {product.originID.country}
                </Link>
              </h4>
            </h6>
            <h6 className="productinfodetail">
              Chất liệu:
              <h4 className="infodetail">{product.material}</h4>
            </h6>
            <h6 className="productinfodetail">
              Các kích thước:
              <h4 className="infodetail">
                {productSizes.map((size, index) => (
                  <span key={index}>
                    {size.sizeID.sizeName}
                    {index < productSizes.length - 1 && ", "}
                  </span>
                ))}
              </h4>
            </h6>
            <h1 className="detail">MÔ TẢ SẢN PHẨM</h1>
            <h5>{product.description}</h5>
          </>
        )}

        <button onClick={toggleDetails} className="toggle-details">
          {isExpanded ? "Ẩn chi tiết" : "Xem thêm"}
        </button>
      </div>

      <div className="container">
        <h1>ĐÁNH GIÁ SẢN PHẨM</h1>
        <div className="rating">{renderStars(avgScore)}</div>
        <h3>{avgScore.toFixed(1)}/5.0</h3>
        <h5>({reviews.length} đánh giá)</h5>
        <div className="comment-overview">
          <div className="cmt-view collapsed">
            {reviews.map((comment, index) => (
              <div className="comment_content" key={index}>
                <div className="reviewer">{comment.accountID.name}</div>
                <div className="rating-comment">
                  {commentStars(comment.rating)}
                </div>
                <div className="comment_text">{comment.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="product-detail">
        <div className="product-container">
          <h1 className="other1">Các sản phẩm khác của hãng</h1>

          {productBrand.map((product) => (
            <div key={product.productID} className="product">
              <a href={`/detail/${product.productID}`} className="product-link">
                <div className="product-image-container">
                  <img
                    style={{
                      height: "250px",
                      width: "250px",
                      objectFit: "cover",
                    }}
                    src={product.avatar}
                    alt={product.title}
                  />
                  <div className="product-overlay">
                    <h3>{product.title}</h3>
                    <p style={{ color: "red" }}>{product.price} đ</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div className="product-container">
          <h1 className="other1">Có thể bạn thích</h1>

          {productSimilar.map((product) => (
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
      </div>
    </>
  );
};

export default ProductDetail;
