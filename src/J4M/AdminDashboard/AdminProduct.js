import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productID: "",
    avatar: "",
    title: "",
    description: "",
    price: "",
    material: "",
    productType: {
      productTypeID: "",
    },
    brandID: {
      brandID: "",
    },
    originID: {
      originID: "",
    },
    status: "Enable",
  });
  const [error, setError] = useState(null);
  const accesstoken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/product", {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách sản phẩm.");
        }

        const data = await response.json();
        setProducts(data.products); // Thay đổi theo cấu trúc dữ liệu trả về
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, [accesstoken]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        // Cập nhật danh sách sản phẩm mà không xóa sản phẩm khỏi danh sách
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.productID === id ? { ...product, status: "Disable" } : product
            )
        );
      } else {
        throw new Error("Không thể xóa sản phẩm.");
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSave = async (id) => {
    try {
      console.log("Saving product with ID:", id);
      console.log("Product data:", newProduct); // Log dữ liệu sản phẩm

      const response = await fetch(`http://localhost:8080/api/v1/admin/product/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Log lỗi trả về từ API
        console.error("Error response:", errorResponse);
        throw new Error("Không thể cập nhật sản phẩm.");
      }

      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
          prevProducts.map((product) =>
              product.productID === id ? updatedProduct : product
          )
      );
      setEditingProductId(null);
      setNewProduct({
        productID: "",
        avatar: "",
        title: "",
        description: "",
        price: "",
        material: "",
        productType: { productTypeID: "" },
        brandID: { brandID: "" },
        originID: { originID: "" },
        status: "Enable",
      });
    } catch (err) {
      setError(err.message);
    }
  };


  const handleCreate = async () => {
    // Kiểm tra các trường nhập
    if (!newProduct.title || !newProduct.price || !newProduct.material || !newProduct.avatar || !newProduct.productType.productTypeID || !newProduct.brandID.brandID || !newProduct.originID.originID) {
      setError("Vui lòng điền đủ các trường cần thiết.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        setProducts([...products, createdProduct]);
        setNewProduct({
          productID: "",
          avatar: "",
          title: "",
          description: "",
          price: "",
          material: "",
          productType: { productTypeID: "" },
          brandID: { brandID: "" },
          originID: { originID: "" },
          status: "Enable",
        }); // Reset input fields
      } else {
        throw new Error("Không thể tạo sản phẩm.");
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleEdit = (product) => {
    setEditingProductId(product.productID);
    setNewProduct({ ...product }); // Sao chép sản phẩm đang sửa vào state
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
      <div>
        <h2>Quản Lý Sản Phẩm</h2>
        <button onClick={handleBackToDashboard}>Quay Lại</button>
        <h3>Thêm Sản Phẩm Mới</h3>
        <div>
          <label >Avatar: </label>
          <input
              type="text"
              value={newProduct.avatar}
              onChange={(e) => setNewProduct({ ...newProduct, avatar: e.target.value })}
          />
          <label>Tên sản phẩm: </label>
          <input
              type="text"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <label>Mô tả: </label>
          <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <label>Loại Sản Phẩm ID: </label>
          <input
              type="text"
              value={newProduct.productType.productTypeID}
              onChange={(e) => setNewProduct({ ...newProduct, productType: { productTypeID: e.target.value } })}
          />
          <label>Giá: </label>
          <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <label>Thương Hiệu ID: </label>
          <input
              type="text"
              value={newProduct.brandID.brandID}
              onChange={(e) => setNewProduct({ ...newProduct, brandID: { brandID: e.target.value } })}
          />
          <label>Xuất Xứ ID: </label>
          <input
              type="text"
              value={newProduct.originID.originID}
              onChange={(e) => setNewProduct({ ...newProduct, originID: { originID: e.target.value } })}
          />
          <label>Chất liệu: </label>
          <input
              type="text"
              value={newProduct.material}
              onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
          />
          <label>Trạng thái: </label>
          <select
              value={newProduct.status}
              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
          >
            <option value="Enable">Enable</option>
            <option value="Disable">Disable</option>
          </select>
          <button onClick={handleCreate}>Thêm</button>
        </div>

        {error && <p>{error}</p>}
        {products.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
        ) : (
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
              <tr>
                <th>ID Sản Phẩm</th>
                <th>Avatar</th>
                <th>Tên Sản Phẩm</th>
                <th>Mô Tả</th>
                <th>Loại Sản Phẩm ID</th>
                <th>Giá</th>
                <th>Thương Hiệu ID</th>
                <th>Xuất Xứ ID</th>
                <th>Chất Liệu</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
              </thead>
              <tbody>
              {products.map((product) => (
                  <tr key={product.productID}>
                    <td>{product.productID}</td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.avatar}
                              onChange={(e) => setNewProduct({ ...newProduct, avatar: e.target.value })}
                          />
                      ) : (
                          product.avatar
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.title}
                              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          />
                      ) : (
                          product.title
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          />
                      ) : (
                          product.description
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.productType.productTypeID}
                              onChange={(e) => setNewProduct({ ...newProduct, productType: { productTypeID: e.target.value } })}
                          />
                      ) : (
                          product.productType.productTypeID
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          />
                      ) : (
                          product.price
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.brandID.brandID}
                              onChange={(e) => setNewProduct({ ...newProduct, brandID: { brandID: e.target.value } })}
                          />
                      ) : (
                          product.brandID.brandID
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.originID.originID}
                              onChange={(e) => setNewProduct({ ...newProduct, originID: { originID: e.target.value } })}
                          />
                      ) : (
                          product.originID.originID
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <input
                              type="text"
                              value={newProduct.material}
                              onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                          />
                      ) : (
                          product.material
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <select
                              value={newProduct.status}
                              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                          >
                            <option value="Enable">Enable</option>
                            <option value="Disable">Disable</option>
                          </select>
                      ) : (
                          product.status
                      )}
                    </td>
                    <td>
                      {editingProductId === product.productID ? (
                          <>
                            <button onClick={() => handleSave(product.productID)}>Lưu</button>
                            <button onClick={() => setEditingProductId(null)}>Hủy</button>
                          </>
                      ) : (
                          <>
                            <button onClick={() => handleEdit(product)}>Sửa</button>
                            <button onClick={() => handleDelete(product.productID)}>Xóa</button>
                          </>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default AdminProduct;
