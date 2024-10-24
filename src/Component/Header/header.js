import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './header.css';

const Header = () => {
    const handleLoginClick = () => {
        console.log("Đăng nhập");
    };

    const handleCartClick = () => {
        console.log("Giỏ hàng");
    };

    return (
        <header className="header">
            <div className="logo">
                <a href="/" className="logo-link">J4M SHOP</a>
            </div>
            <nav class="nav">
                <ul class="nav-links">
                    <li><a href="#">HÀNG MỚI VỀ</a></li>
                    <li><a href="#">QUẦN NAM</a></li>
                    <li><a href="#">ÁO NAM </a></li>
                    <li><a href="#">J4M</a></li>
                </ul>
          </nav>
            <div className="search-cart">
                <input type="text" placeholder="Tìm kiếm" className="search-input" />
                <button className="login-button" onClick={handleLoginClick}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <button className="cart-button" onClick={handleCartClick}>
                    <FontAwesomeIcon icon={faCartShopping} />
                </button>
            </div>
        </header>
    );
};

export default Header;
