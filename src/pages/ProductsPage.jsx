import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  Row,
  Col,
  Input,
  Select,
  Slider,
  Card,
  Breadcrumb,
  Rate,
  Checkbox,
  Divider,
  Spin,
  Pagination,
  message,
} from "antd";

import {
  SearchOutlined,
  FireOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import ProductList from "../components/product/ProductList";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortType, setSortType] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/products");

      if (res.data.success) {
        setProducts(res.data.products);
        setAllProducts(res.data.products);
      } else {
        message.error("Không thể tải sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      message.error("Không thể kết nối backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    setSearchText(search);

    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }

    setCurrentPage(1);
  }, [searchParams]);

  const handleFilterAndSort = useCallback(() => {
    let tempProducts = [...allProducts];

    const gender = searchParams.get("gender");
    const sale = searchParams.get("sale");

    if (searchText.trim() !== "") {
      tempProducts = tempProducts.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    if (gender) {
      tempProducts = tempProducts.filter(
        (item) => item.gender === gender || item.gender === "unisex",
      );
    }

    if (sale === "true") {
      tempProducts = tempProducts.filter(
        (item) => item.isSale === true || item.discount > 0,
      );
    }

    tempProducts = tempProducts.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1],
    );

    if (selectedRating !== null) {
      tempProducts = tempProducts.filter(
        (item) => item.rating >= selectedRating,
      );
    }

    if (sortType === "low") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortType === "newest") {
      tempProducts.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    setProducts(tempProducts);
    setCurrentPage(1);
  }, [
    allProducts,
    searchText,
    selectedCategories,
    priceRange,
    selectedRating,
    sortType,
    searchParams,
  ]);

  useEffect(() => {
    handleFilterAndSort();
  }, [handleFilterAndSort]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(
      (item) => item._id === product._id || item.id === product._id,
    );

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += 1;
    } else {
      const productImg =
        product.images?.[0] ||
        product.image ||
        "https://placehold.co/600x600?text=Fashion+AI";

      cart.push({
        ...product,
        id: product._id,
        _id: product._id,
        image: productImg,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  return (
    <div
      style={{
        background: "#f9fafb",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          height: 300,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "8%",
          }}
        >
          <p
            style={{
              color: "#3b82f6",
              letterSpacing: 2,
              fontWeight: 600,
              margin: 0,
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            FASHION AI STORE
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
              marginBottom: 8,
            }}
          >
            Fashion Collection
          </h1>

          <p style={{ color: "#9ca3af", fontSize: 16, margin: 0 }}>
            Khám phá xu hướng thời trang hiện đại cùng Stylist AI
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        <Breadcrumb
          items={[{ title: "Trang chủ" }, { title: "Sản phẩm" }]}
          style={{ marginBottom: 24 }}
        />

        <Row gutter={[32, 32]}>
          <Col xs={24} md={8} lg={6}>
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                position: "sticky",
                top: 24,
              }}
            >
              <div
                style={{
                  marginBottom: 20,
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FilterOutlined style={{ color: "#3b82f6" }} />
                Bộ lọc tìm kiếm
              </div>

              <Input
                size="large"
                placeholder="Tìm sản phẩm..."
                prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: 10 }}
                allowClear
              />

              <Divider style={{ margin: "20px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 600, color: "#374151", margin: 0 }}>
                  Khoảng giá
                </p>

                <span
                  style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500 }}
                >
                  {priceRange[0].toLocaleString()}đ -{" "}
                  {priceRange[1].toLocaleString()}đ
                </span>
              </div>

              <Slider
                range
                value={priceRange}
                max={5000000}
                min={0}
                step={100000}
                onChange={(value) => setPriceRange(value)}
                style={{ marginTop: 12 }}
              />

              <Divider style={{ margin: "20px 0" }} />

              <p
                style={{
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 12,
                }}
              >
                Danh mục
              </p>

              <Checkbox.Group
                style={{ width: "100%" }}
                value={selectedCategories}
                onChange={(checkedValues) =>
                  setSelectedCategories(checkedValues)
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <Checkbox value="ao">Áo thời trang</Checkbox>
                  <Checkbox value="quan">Quần thiết kế</Checkbox>
                  <Checkbox value="giay">Giày thể thao</Checkbox>
                  <Checkbox value="phu-kien">Phụ kiện</Checkbox>
                </div>
              </Checkbox.Group>

              <Divider style={{ margin: "20px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <p style={{ fontWeight: 600, color: "#374151", margin: 0 }}>
                  Đánh giá
                </p>

                {selectedRating !== null && (
                  <span
                    onClick={() => setSelectedRating(null)}
                    style={{
                      fontSize: 12,
                      color: "#ef4444",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Xóa lọc
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  onClick={() => setSelectedRating(5)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 6,
                    background:
                      selectedRating === 5 ? "#eff6ff" : "transparent",
                  }}
                >
                  <Rate disabled defaultValue={5} style={{ fontSize: 16 }} />
                  <span
                    style={{
                      fontSize: 13,
                      color: selectedRating === 5 ? "#3b82f6" : "#6b7280",
                    }}
                  >
                    Từ 5 sao
                  </span>
                </div>

                <div
                  onClick={() => setSelectedRating(4)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 6,
                    background:
                      selectedRating === 4 ? "#eff6ff" : "transparent",
                  }}
                >
                  <Rate disabled defaultValue={4} style={{ fontSize: 16 }} />
                  <span
                    style={{
                      fontSize: 13,
                      color: selectedRating === 4 ? "#3b82f6" : "#6b7280",
                    }}
                  >
                    Từ 4 sao trở lên
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={16} lg={18}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: 16,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                    lineHeight: "1.2",
                  }}
                >
                  Sản phẩm nổi bật
                </h2>

                <p
                  style={{
                    color: "#6b7280",
                    margin: 0,
                    marginTop: 6,
                    fontSize: 14,
                  }}
                >
                  Tìm thấy <b>{products.length}</b> sản phẩm phù hợp
                </p>
              </div>

              <Select
                value={sortType}
                style={{ width: 200 }}
                onChange={(value) => setSortType(value)}
                options={[
                  { label: "Mới nhất", value: "newest" },
                  { label: "Giá thấp đến cao", value: "low" },
                  { label: "Giá cao đến thấp", value: "high" },
                ]}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
                color: "#ef4444",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              <FireOutlined />
              <span>Trending Fashion 2026</span>
            </div>

            {currentProducts.length > 0 ? (
              <ProductList
                products={currentProducts}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#9ca3af",
                }}
              >
                Không tìm thấy sản phẩm nào khớp với bộ lọc.
              </div>
            )}

            {products.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 48,
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={products.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    if (size) setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={[6, 12, 18]}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsPage;
