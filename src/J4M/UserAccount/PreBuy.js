import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreBuy.css';
import payment from "./Image/payment.png";
import vnpay from "./Image/vnpay.jpg";
import deleteicon from "./Image/deleteicon.png";

const PreBuy = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]); // State để lưu trữ discount
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem('access_token');
  const [selectedDiscount, setSelectedDiscount] = useState(null); // State để lưu mã giảm giá đã chọn
  const [appliedDiscount, setAppliedDiscount] = useState(0); // State để lưu số tiền giảm giá đã áp dụng
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash"); // State để lưu phương thức thanh toán
  const [errorMessages, setErrorMessages] = useState({}); // State để lưu lỗi cho từng sản phẩm

  useEffect(() => {
    if (accesstoken) {
      fetch('http://localhost:8080/prebuy', {
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch cart items.');
        }
        return response.json();
      })
      .then((data) => {
        const itemsWithSelectedSize = data.cart.map(item => ({
          ...item,
          selectedSize: item.selectedSize || item.sizes[0],
          selected: false,
        }));
        
        setCartItems(itemsWithSelectedSize);
        setDiscounts(data.discount || []);
        
        // Store fetched cart items and discounts in localStorage
        localStorage.setItem('cartItems', JSON.stringify(itemsWithSelectedSize));
        localStorage.setItem('discounts', JSON.stringify(data.discount || []));
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi lấy giỏ hàng hoặc dữ liệu giảm giá.");
        console.error(error);
      });
    } else {
      navigate('/login');
    }
  }, [accesstoken, navigate]);
  
  // Thêm useEffect để lấy discount
  useEffect(() => {
    if (accesstoken) {
      fetch('http://localhost:8080/prebuy', {
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch discounts.');
        }
        return response.json();
      })
      .then((data) => {
        setDiscounts(data.discount || []);
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi lấy dữ liệu giảm giá.");
        console.error(error);
      });
    }
  }, [accesstoken]);

  const handleSizeChange = (cartID, selectedSize) => {
    const cartItem = cartItems.find(item => item.cartID === cartID);
    if (cartItem) {
      const updatedItems = cartItems.map(item =>
        item.cartID === cartID ? { ...item, selectedSize } : item
      );
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      updateCart(cartID, cartItem.number, selectedSize);
    }
  };

  const handleQuantityChange = (cartID, quantity) => {
    const newQuantity = parseInt(quantity, 10) || 1; 
    const cartItem = cartItems.find(item => item.cartID === cartID);
  
    // Kiểm tra số lượng vượt quá tồn kho
    if (cartItem && newQuantity > cartItem.stock[cartItem.sizes.indexOf(cartItem.selectedSize)]) {
      setErrorMessages(prevErrors => ({
        ...prevErrors,
        [cartID]: `Số lượng nhập vào không được lớn hơn ${cartItem.stock[cartItem.sizes.indexOf(cartItem.selectedSize)]}.`
      }));
      return;
    } else {
      setErrorMessages(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[cartID];
        return newErrors;
      });
    }
  
    // Cập nhật số lượng trong giỏ hàng khi hợp lệ
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.cartID === cartID ? { ...item, number: newQuantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems)); 
      return updatedItems;
    });
  
    if (cartItem) {
      updateCart(cartID, newQuantity, cartItem.selectedSize);
    }
  };
  
  

  const updateCart = (cartID, number, size) => {
    const requestBody = {
      number: parseInt(number, 10),
      size: size.trim(),
    };

    fetch(`http://localhost:8080/prebuy/${cartID}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Could not update cart.');
      }
      return response.json();
    })
    .then((updatedCart) => {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartID === cartID ? { ...item, ...updatedCart } : item
        )
      );
    })
    .catch((error) => {
      setError("Có lỗi xảy ra khi cập nhật giỏ hàng.");
      console.error(error);
    });
  };

  const handleDelete = (cartID) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (confirmDelete) {
      fetch(`http://localhost:8080/prebuy/${cartID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not delete cart item.');
        }
        const updatedCartItems = cartItems.filter(item => item.cartID !== cartID);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); 
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa sản phẩm.");
        console.error(error);
      });
    }
  };
  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate[0], endDate[1] - 1, endDate[2]); 
    const now = new Date();
    const timeDiff = end - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 
    return daysLeft >= 0 ? daysLeft : 0; 
  };
  const calculateTotalPrice = () => {
    return cartItems
      .filter(item => item.selected) 
      .reduce((total, item) => total + (item.productPrice * item.number), 0);
  };
  const calculateDiscountAmount = (totalPrice) => {
    return appliedDiscount; // Sử dụng giá trị giảm giá đã áp dụng
  };
  const deleteDiscount = (discountID) => {
    fetch(`http://localhost:8080/api/v1/admin/discount/${discountID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not delete discount.');
      }
      console.log('Discount deleted successfully');
      // Cập nhật lại danh sách discount nếu cần thiết
      setDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount.discountID !== discountID));
    })
    .catch(error => {
      console.error(error);
      setError("Có lỗi xảy ra khi xóa mã giảm giá.");
    });
  };
  
  const handleBuy = () => {
    if (Object.keys(errorMessages).length > 0) {
      setError("Không thể thanh toán vì có sản phẩm vượt quá số lượng tồn kho.");
      return;
    }
  
    const selectedItems = cartItems.filter(item => item.selected);
    const cartIDs = selectedItems.map(item => item.cartID);
  
    if (cartIDs.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để mua.');
      return;
    }

    const params = new URLSearchParams();
    cartIDs.forEach(id => params.append('cartID', id));

    const url = `http://localhost:8080/prebuy/buy?${params.toString()}`;

    console.log("POST URL:", url);

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accesstoken}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error('Error response:', text);
          throw new Error('Could not complete the purchase.');
        });
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return response.text().then(text => {
          console.log('Response text:', text);
          return text;
        });
      }
    })
    .then(data => {
      alert(data);
      if (selectedDiscount) {
        deleteDiscount(selectedDiscount);
      }
      const updatedCartItems = cartItems.filter(item => !item.selected);
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      navigate("/PaymentSuccess");  
    })
    .catch((error) => {
      setError("Có lỗi xảy ra khi thực hiện giao dịch.");
      console.error(error);
    });
  };

  const handleBuyVNPay = () => {
    if (Object.keys(errorMessages).length > 0) {
      setError("Không thể thanh toán vì có sản phẩm vượt quá số lượng tồn kho.");
      return;
    }
  
    const selectedItems = cartItems.filter(item => item.selected);
    const cartIDs = selectedItems.map(item => item.cartID);
  
    if (cartIDs.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    const queryParams = selectedItems
        .map(item => `cartID=${item.cartID}&quantities=${item.number}`)
        .join('&');

    fetch(`http://localhost:8080/setCart?${queryParams}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accesstoken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not update cart.');
        }
        return response.text();
    })
    .then(() => {
        const totalPayment = calculateTotalPrice() - calculateDiscountAmount(calculateTotalPrice());
        return fetch(`http://localhost:8080/pay?totalPayment=${totalPayment}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accesstoken}`
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not initiate payment.');
        }
        return response.text();
    })
    .then(vnpayUrl => {
        window.location.href = vnpayUrl;
        window.addEventListener('beforeunload', () => {
            const updatedCartItems = cartItems.filter(item => !item.selected);
            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        });
    })
    .catch(error => {
        setError("Có lỗi xảy ra khi thực hiện thanh toán qua VNPay.");
        console.error(error);
    });
};



const handleCheckboxChange = (cartID) => {
  const updatedItems = cartItems.map(item =>
    item.cartID === cartID ? { ...item, selected: !item.selected } : item
  );
  setCartItems(updatedItems);
  localStorage.setItem('cartItems', JSON.stringify(updatedItems));
};

const handleApplyDiscount = () => {
  console.log('Selected Discount:', selectedDiscount); // Logging giá trị của selectedDiscount

  if (!selectedDiscount) {
      alert('Vui lòng chọn mã giảm giá.');
      return;
  }

  const selectedDiscountObj = discounts.find(discount => discount.discountID === selectedDiscount);
  console.log('Selected Discount Object:', selectedDiscountObj); // Logging đối tượng giảm giá được chọn

  if (selectedDiscountObj) {
      const totalPrice = calculateTotalPrice();
      const discountAmount = totalPrice * selectedDiscountObj.discountPercent; 
      setAppliedDiscount(discountAmount);
  } else {
      alert('Vui lòng chọn mã giảm giá hợp lệ.');
  }
};

const handleDiscountChange = (event) => {
  setSelectedDiscount(Number(event.target.value)); // Chuyển đổi sang số
};
const totalPrice = calculateTotalPrice();
const discountAmount = calculateDiscountAmount(totalPrice);
const totalPayment = totalPrice - discountAmount;

  return (
    <div>
<h2>Giỏ hàng của bạn:</h2>
{error && <p>{error}</p>}
    {cartItems.length > 0 ? (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ul className="cart-list">
          {cartItems.map(item => (
      <div key={item.cartID} className="cart-item">
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={item.selected}
            onChange={() => handleCheckboxChange(item.cartID)} 
          />
          <img
            src={item.avatar}
            alt={item.productTitle}
          />
          <div style={{ flex: 1 }}> 
            <p className="product-title">{item.productTitle}</p> 
            <p className="product-price">
              Giá: {(item.productPrice * item.number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
            </p>
            <label className="product-size-label">
              Kích thước:
              <select
                value={item.selectedSize}
                onChange={(e) => handleSizeChange(item.cartID, e.target.value)}
                className="product-size-select"  
                style={{ marginLeft: '5px' }}
              >
                {item.sizes.map((size, index) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <p className="product-stock" style={{ fontSize: '1em', color: '#999', marginTop: '5px' }}>
              Tồn kho: {item.stock[item.sizes.indexOf(item.selectedSize)]}
            </p>
            <label style={{ marginLeft: '10px' }}>
              Số lượng:
              <input
                type="number"
                min="1"
                value={item.number}
                onChange={(e) => handleQuantityChange(item.cartID, e.target.value)}
                style={{ width: '80px', marginLeft: '5px' }}
              />
              {errorMessages[item.cartID] && (
                <p style={{ color: 'red' }}>{errorMessages[item.cartID]}</p>
              )}
            </label>
          </div>
          <img
              src={deleteicon}
              alt="Xóa"
              onClick={() => handleDelete(item.cartID)} 
              className="delete-icon"
          />
        </li>
      </div>
    ))}
      </ul>
    </div>
    <div style={{ flex: 1, paddingLeft: '20px' }}>
      <div className="price-summary">
        <h3 className="total-price">Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VND</h3>
        <h3 className="discount-amount">Giảm giá: {discountAmount.toLocaleString('vi-VN')} VND</h3>
        <h3 className="total-payment">Tổng thanh toán: {totalPayment.toLocaleString('vi-VN')} VND</h3>
      </div>
      <select value={selectedDiscount || ""} onChange={handleDiscountChange} className="discount-select">
          <option value="">Chọn mã giảm giá</option>
          {discounts
              .filter(discount => discount.status === "Enable")
              .map(discount => (
                  <option key={discount.discountID} value={discount.discountID}>
                      Giảm giá {discount.discountPercent * 100}% (ID: {discount.discountID})
                  </option>
              ))}
      </select>
      <button onClick={handleApplyDiscount}>Áp dụng</button>
      <div className="payment-options">
        <h3>Phương thức thanh toán</h3>
        <label className="payment-option">
          <input
            type="radio"
            value="vnpay"
            checked={selectedPaymentMethod === "vnpay"}
            onChange={() => setSelectedPaymentMethod("vnpay")}
          />
          <img src={vnpay} alt="VNPay" className="payment-icon" />
          VNPay
        </label>
        <label className="payment-option">
          <input
            type="radio"
            value="cash"
            checked={selectedPaymentMethod === "cash"}
            onChange={() => setSelectedPaymentMethod("cash")}
          />
          <img src={payment} alt="Thanh toán khi nhận hàng" className="payment-icon" />
          Thanh toán khi nhận hàng
        </label>
        <button
          onClick={() => selectedPaymentMethod === 'vnpay' ? handleBuyVNPay() : handleBuy()}
          className="payment-button"
        >
          Thanh toán
        </button>
      </div>
    </div>
  </div>
) : (
  <p>Giỏ hàng của bạn đang trống.</p>
)}

    </div>
  );
};

export default PreBuy;
