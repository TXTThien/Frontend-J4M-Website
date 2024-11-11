import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './NewsDetail.css';

export default function NewsDetail() {
  const { id } = useParams(); // Get the news ID from URL
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news details:", error);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (!news) return <p>Loading...</p>;

  return (
    <div className="news-detail">
      <img src={news.newsImage} alt={news.newsTitle} className="news-detail-image" />
      <h1>{news.newsTitle}</h1>
      <p className="news-detail-date">{new Date(news.date).toLocaleDateString()}</p>
      <div className="news-detail-content">{news.content}</div>
    </div>
  );
}
