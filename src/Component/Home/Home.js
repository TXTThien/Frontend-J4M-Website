// src/HomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);
  const [SPProducts, setHotProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/homepage");
        console.log(response.data);
        setBanners(response.data.bannerList);
        setHotProducts(response.data.productList);
        setNews(response.data.newsList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      <Slider {...settings} className="banner-slider">
        {banners.map((banner) => (
          <div key={banner.bannerID} className="banner">
            <a
              href={
                banner.productID?.productID
                  ? `/detail/${banner.productID.productID}`
                  : banner.productTypeID?.productTypeID
                  ? `/product?productType=${banner.productTypeID.productTypeID}`
                  : `/product?category=${banner.categoryID?.categoryID}`
              }
            >
              <img
                src={banner.bannerImage}
                alt={banner.title}
                className="banner-image"
              />
            </a>
          </div>
        ))}
      </Slider>
      <div className="legit-container">
        <div className="policies-box">
          <div className="policy-item">
            <img
              src="https://theme.hstatic.net/200000294254/1001077164/14/header_03_policy_1_ico.png?v=344"
              alt="100% sách chính hãng"
              className="legit-image"
            />
            <span>100% hàng chính hãng</span>
          </div>
          <div className="policy-item">
            <img
              src="https://theme.hstatic.net/200000294254/1001077164/14/header_03_policy_2_ico.png?v=344"
              alt="Hoàn trả trong 7 ngày"
              className="legit-image"
            />
            <span>Hoàn trả trong 7 ngày</span>
          </div>
          <div className="policy-item">
            <img
              src="https://theme.hstatic.net/200000294254/1001077164/14/header_03_policy_3_ico.png?v=344"
              alt="Miễn phí vận chuyển"
              className="legit-image"
            />
            <span>Miễn phí vận chuyển</span>
          </div>
        </div>
      </div>

      <h2 className="featured-title">Sản phẩm nổi bật</h2>
      <div className="product-container">
        {SPProducts.map((product) => (
          <div key={product.productID} className="product">
            <a href={`/detail/${product.productID}`}>
              <img src={product.avatar} alt={product.title} />
              <h3>{product.title}</h3>
              <p style={{ color: "red" }}>{product.price} đ</p>
              <p className="sold-quantity" style={{ fontSize: "0.8rem" }}>
                Đã bán: {product.sold}
              </p>
            </a>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="boxXemThem">
        <a href="/product" class="xem-them">
          Xem thêm
        </a>
      </div>
      <div className="news">
        <div className="row">
          <h1 className="newsTitle">Tin tức mới nhất</h1>
        </div>
        <div className="row">
          <div className="col-7">
            {news.map((item) => (
              <div key={item.newsID} className="news-item">
                <a
                  href={`/news/${item.newsID}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="image-container">
                    <img
                      src={item.newsImage}
                      alt={item.newsTitle}
                      className="news-image"
                    />
                  </div>
                  <div className="news-details">
                    <h3 className="news-title">{item.newsTitle}</h3>
                    <h4 className="news-date">{formatDate(item.date)}</h4>
                    <h5 className="news-content">
                      {item.content.substring(0, 200)}...
                    </h5>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="boxXemThem">
        <a href="/news" class="xem-them">
          Xem thêm
        </a>
      </div>
    </div>
  );
};

export default HomePage;
