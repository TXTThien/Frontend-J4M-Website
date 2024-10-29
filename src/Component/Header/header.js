import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './header.css';

const Header = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0); // Trạng thái cho số lượng sản phẩm trong giỏ hàng

    const handleLoginClick = () => {
        console.log("Đăng nhập");
    };

    const handleCartClick = () => {
        console.log("Giỏ hàng");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const scrollToFooter = () => {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <header className="header">
            <div className="logo">
                <a href="/home" className="logo-link">J4M SHOP</a>
            </div>
            <nav className="nav">
                <ul className="nav-links">
                    <li onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                        <a href="#">Danh Mục </a>
                        {isDropdownOpen && (
                            <ul className="dropdown">
                                <li><a href="#">Tất cả</a></li>
                                <li><a href="#">Áo Nam</a></li>
                                <li><a href="#">Quần Nam</a></li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <a href="/tin-tuc" onClick={() => console.log("Chuyển hướng đến trang tin tức")}>Tin tức</a>
                    </li>
                    <li>
                        <a href="#" onClick={scrollToFooter}>Thông Tin liên lạc</a>
                    </li>
                </ul>
            </nav>
            <div className="search-cart">
                <input type="text" placeholder="Tìm kiếm" className="search-input" />
                <button className="login-button" onClick={handleLoginClick}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button className="cart-button" onClick={handleCartClick}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span className="cart-count">{cartCount > 0 ? cartCount : 0}</span> {/* Hiển thị số lượng sản phẩm */}
                </button>
            </div>
        </header>
    );
};

export default Header;
