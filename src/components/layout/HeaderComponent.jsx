import { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Badge,
  Input,
  Button,
  Dropdown,
  Avatar,
  Space,
} from "antd";

import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleSearch = () => {
    const keyword = searchText.trim();

    if (keyword) {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate("/products");
    }
  };

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "/products",
      label: <Link to="/products">Sản phẩm</Link>,
    },
    {
      key: "/products?gender=men",
      label: <Link to="/products?gender=men">Nam</Link>,
    },
    {
      key: "/products?gender=women",
      label: <Link to="/products?gender=women">Nữ</Link>,
    },
    {
      key: "/products?sale=true",
      label: <Link to="/products?sale=true">Sale</Link>,
    },
  ];

  const userItems = [
    {
      key: "account",
      label: <Link to="/profile">Tài khoản</Link>,
    },
    {
      key: "orders",
      label: <Link to="/orders">Đơn hàng</Link>,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const selectedKey =
    location.pathname === "/"
      ? "/"
      : location.pathname.startsWith("/products")
        ? "/products"
        : location.pathname;

  return (
    <Header
      style={{
        height: 80,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111827",
                whiteSpace: "nowrap",
              }}
            >
              Fashion AI
            </div>
          </Link>

          <div style={{ flex: 1, minWidth: 0 }}>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={menuItems}
              overflowedIndicator={<MenuOutlined />}
              style={{
                borderBottom: "none",
                minWidth: 0,
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            style={{
              width: 220,
              height: 42,
              borderRadius: 30,
              background: "#f3f4f6",
            }}
          />

          <Badge count={0}>
            <Link to="/wishlist">
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#111827",
                }}
              >
                <HeartOutlined style={{ fontSize: 18 }} />
              </div>
            </Link>
          </Badge>

          <Link to="/cart">
            <Badge count={cartCount}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#111827",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ShoppingCartOutlined
                  style={{
                    fontSize: 18,
                    color: "#fff",
                  }}
                />
              </div>
            </Badge>
          </Link>

          <Link to="/login">
            <Button
              style={{
                height: 42,
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Đăng nhập
            </Button>
          </Link>

          <Link to="/register">
            <Button
              type="primary"
              style={{
                height: 42,
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Đăng ký
            </Button>
          </Link>

          <Dropdown menu={{ items: userItems }} trigger={["click"]}>
            <Space
              style={{
                cursor: "pointer",
                marginLeft: 6,
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{
                  background: "#2563eb",
                }}
              />

              <DownOutlined style={{ fontSize: 11 }} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
