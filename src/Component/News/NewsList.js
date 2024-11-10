import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import "./NewsList.css";

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:8080/news");
        setNewsList(response.data.News);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  const getShortDescription = (content) => {
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  return (
    <div className="news-list-container">
    <h1>Tin Tức Thời Trang</h1>
    <div className="news-grid">
      {newsList.length > 0 ? (
        newsList.map((news) => (
          <Link to={`/news/${news.newsID}`} key={news.newsID} className="news-link">
            <div className="news-card">
              <img src={news.newsImage} alt={news.newsTitle} className="news-image" />
              <h2>{news.newsTitle}</h2>
              <p>{getShortDescription(news.content)}</p>
              <p><em>Ngày đăng: {new Date(news.date).toLocaleDateString()}</em></p>
            </div>
          </Link>
        ))
      ) : (
        <p>Không có tin tức để hiển thị</p>
      )}
    </div>
  </div>
  );
}
