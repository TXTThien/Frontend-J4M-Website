import React from 'react';
import './footer.css'; // Import custom CSS for styling

const Footer = () => {
  return (
    <footer id='footer' className="footer">
      <div className="footer-container">
        {/* Top Section with contact and social links */}
        <div className="footer-top">
          <div className="contact">
            <span className="icon">📞</span>
            <span>19000402</span>
          </div>
          <div className="social">
            <span className="icon">📘</span>
            <span>J4M.vn</span>
          </div>
          <div className="rights">
            Bản quyền thuộc nhóm 6 
          </div>
        </div>
        <div className="footer-middle">
          <h2>WEB BÁN ĐỒ NAM J4M</h2>
          <p>
            Địa Chỉ: Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh
            <br />
            Điện Thoại: 84-28-38154064 - Fax: 84-28-38154067 - Website: www.j4m.com- Email: j4m@gmail.com
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
