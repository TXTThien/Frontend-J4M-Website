// src/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import './Home.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const HomePage = () => {
    const [banners, setBanners] = useState([]);
    const [SPProducts, setHotProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/homepage'); 
                console.log(response.data); 
                setBanners(response.data.bannerList);
                setHotProducts(response.data.productList);
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
        arrows: true, 
    };

    return (
        <div>
            {error && <p className="error">{error}</p>}     
            <Slider {...settings} className="banner-slider">
                {banners.map((banner) => (
                    <div key={banner.bannerID} className="banner">
                        <img src={banner.bannerImage} alt={banner.title} className="banner-image" />                      
                    </div>
                ))}
            </Slider>
            <h2 className="featured-title">Sản phẩm nổi bật</h2>
            <div className="product-container">
                {SPProducts.map((product) => (
                    <div key={product.productID} className="product">
                        <img src={product.avatar} alt={product.title} />
                        <h3>{product.title}</h3>
                        <p style={{ color: 'red' }}>{product.price} đ</p>
                        <p className="sold-quantity" style={{ fontSize: '0.8rem' }}>Đã bán: {product.sold}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
