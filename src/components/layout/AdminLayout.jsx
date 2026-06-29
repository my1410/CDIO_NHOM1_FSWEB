import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Space, Button } from "antd";

import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/customers",
      icon: <TeamOutlined />,
      label: <Link to="/admin/customers">Quản lý khách hàng</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Sản phẩm</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Đơn hàng</Link>,
    },

    {
      key: "/admin/inventory",
      label: <Link to="/admin/inventory">Kho hàng</Link>,
    },

    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      label: <Link to="/admin/statistics">Thống kê</Link>,
    },
  ];

  const userItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Về trang chủ",
      onClick: () => navigate("/"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => navigate("/login"),
    },
  ];

  const selectedKey = location.pathname.startsWith("/admin/products")
    ? "/admin/products"
    : location.pathname.startsWith("/admin/orders")
      ? "/admin/orders"
      : location.pathname.startsWith("/admin/users")
        ? "/admin/users"
        : location.pathname.startsWith("/admin/analytics")
          ? "/admin/analytics"
          : "/admin";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Sider
        width={260}
        style={{
          background: "#111827",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            color: "#fff",
            fontSize: 24,
            fontWeight: 800,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Fashion Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            background: "#111827",
            padding: "16px 10px",
            fontWeight: 600,
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            height: 80,
            background: "#fff",
            padding: "0 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Space>
            <Button icon={<MenuFoldOutlined />} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                Admin Dashboard
              </div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                Quản lý cửa hàng Fashion AI
              </div>
            </div>
          </Space>

          <Dropdown menu={{ items: userItems }} trigger={["click"]}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                icon={<UserOutlined />}
                style={{ background: "#2563eb" }}
              />
              <span style={{ fontWeight: 600 }}>Admin</span>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: 30,
            background: "#f3f4f6",
            minHeight: "calc(100vh - 80px)",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
