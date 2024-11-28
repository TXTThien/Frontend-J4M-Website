import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Trạng thái cho số lượng sản phẩm trong giỏ hàng
  const accountId = localStorage.getItem("accountID");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [bannerList, setBannerList] = useState(null);
  const [newsList, setNewsList] = useState(null);
  const [productList, setProductList] = useState(null);
  const [categories, setCategories] = useState(null);
  const [productTypes, setProductTypes] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/homepage`);
      if (response.status === 200) {
        const { bannerList, newsList, productList, categories, productTypes } =
          response.data;
        setBannerList(bannerList);
        setNewsList(newsList);
        setProductList(productList);
        setCategories(categories);
        setProductTypes(productTypes);

        // Log categories to check structure
        console.log("Categories fetched:", categories);
      } else {
        setError("Product not available or disabled.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoginClick = async () => {
    try {
      const response = await axios.get("http://localhost:8080/info", {
        headers: {
          "Account-ID": accountId,
        },
        withCredentials: true,
      });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.log("Đăng nhập thất bại:", error);
    }
  };
  const accesstoken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCartData = async () => {
      if (accesstoken) {
        try {
          const response = await axios.get("http://localhost:8080/prebuy", {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              "Account-ID": accountId,
            },
            withCredentials: true,
          });

          if (response.status === 200) {
            const { cart } = response.data;
            setCartCount(cart.length);
          }

          if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
          }
        } catch (error) {
          console.log("Có lỗi xảy ra khi lấy giỏ hàng:", error);
        }
      }
    };

    fetchCartData();
  }, [accesstoken, accountId]);

  const handlePrebuy = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cart", {
        headers: {
          "Account-ID": accountId,
        },
        withCredentials: true,
      });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.log("Đăng nhập thất bại:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      const footerPosition =
        footer.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = footerPosition - startPosition;
      const duration = 1000;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = (t) => t * (2 - t);

        window.scrollTo(0, startPosition + distance * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await axios.get("http://localhost:8080/search", {
          params: { searchTerm },
          headers: { "Account-ID": accountId },
        });

        navigate("/find", { state: { results: response.data } });
        setError(null);
      } catch (error) {
        setError("Không tìm thấy sản phẩm nào!");
      }
    }
  };
  return (
    <header className="header">
      <div className="logo">
        <a href="/" className="logo-link">
          J4M SHOP
        </a>
      </div>
      <nav className="nav">
        <ul className="nav-links">
          <li onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <a href="product">Danh Mục </a>
            {isDropdownOpen && (
              <ul className="dropdown">
                <li>
                  <a href="/product">Tất cả</a>
                </li>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.categoryID}>
                      <a
                        href={`/product?category=${category.categoryID}`}
                      >
                        {category.categoryName}{" "}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>Không có danh mục nào.</li>
                )}
              </ul>
            )}
          </li>
          <li>
            <a
              href="/news"
              onClick={() => console.log("Chuyển hướng đến trang tin tức")}
            >
              Tin tức
            </a>
          </li>
          <li>
            <a style={{ cursor: "pointer" }} onClick={scrollToFooter}>
              Thông Tin liên lạc
            </a>
          </li>
        </ul>
      </nav>
      <div className="search-cart">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>{" "}
        <button className="login-button" onClick={handleLoginClick}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="cart-button" onClick={handlePrebuy}>
          <FontAwesomeIcon icon={faCartShopping} />
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
