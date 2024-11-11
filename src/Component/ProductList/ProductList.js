import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";
export default function ProductList() {
  const sizePage = 20;
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [productType, setProductType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [origin, setOrigin] = useState([]);
  const [size, setSize] = useState([]);
  const [visibleCount, setVisibleCount] = useState(sizePage);
  const [sortParams, setSortParams] = useState({
    origin: "",
    size: "",
    category: "",
    productType: "",
    brand: "",
  });

  const filteredProductTypes = sortParams.category
    ? productType.filter(
        (pt) => pt.categoryID.categoryID === parseInt(sortParams.category)
      )
    : productType;

  const sortProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/product/sort", {
        params: sortParams,
      });
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product");
        const { products, category, productType, brand, origin, size } =
          response.data;
        setCategory(category);
        setProductType(productType);
        setBrand(brand);
        setOrigin(origin);
        setSize(size);
        setAllProducts(products);
        setProducts(products.slice(0, visibleCount));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    sortProducts();
  }, [sortParams]);
  
  useEffect(() => {
    setProducts(allProducts.slice(0, visibleCount));
  }, [allProducts, visibleCount]);
  return (
    <>
      <div className="product-list-container">
        <h1>Trang sản phẩm</h1>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={sortParams.category}
              onChange={(e) => {
                setSortParams({ ...sortParams, category: e.target.value });
              }}
            >
              <option value="">All</option>
              {category.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="productType">Product Type:</label>
            <select
              id="productType"
              value={sortParams.productType}
              onChange={(e) =>
                setSortParams({ ...sortParams, productType: e.target.value })
              }
            >
              <option value="">All</option>
              {filteredProductTypes.map((pt) => (
                <option key={pt.productTypeID} value={pt.productTypeID}>
                  {pt.typeName}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="brand">Brand:</label>
            <select
              id="brand"
              value={sortParams.brand}
              onChange={(e) =>
                setSortParams({ ...sortParams, brand: e.target.value })
              }
            >
              <option value="">All</option>
              {brand.map((b) => (
                <option key={b.brandID} value={b.brandID}>
                  {b.brandName}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="origin">Origin:</label>
            <select
              id="origin"
              value={sortParams.origin}
              onChange={(e) =>
                setSortParams({ ...sortParams, origin: e.target.value })
              }
            >
              <option value="">All</option>
              {origin.map((o) => (
                <option key={o.originID} value={o.originID}>
                  {o.country}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="size">Size:</label>
            <select
              id="size"
              value={sortParams.size}
              onChange={(e) =>
                setSortParams({ ...sortParams, size: e.target.value })
              }
            >
              <option value="">All</option>
              {size.map((s) => (
                <option key={s.sizeID} value={s.sizeID}>
                  {s.sizeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-grid">
          {products.length > 0 &&
            products.map((product) => (
              <div key={product.productID} className="product-card">
                <div className="img-wrapper">
                  <img src={product.avatar} alt={product.title} />
                </div>
                <h2>{product.title}</h2>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Brand: {product.brandID.brandName}</p>
                <p>Origin: {product.originID.country}</p>
              </div>
            ))}
        </div>
        <div className="load-button">
          <button  onClick={() => setVisibleCount(visibleCount + sizePage)}>
            Tải thêm
          </button>
        </div>
      </div>
    </>
  );
}
