import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Button,
  Drawer,
  Grid,
} from "antd";

import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isCompact = !screens.lg;

  const navItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      title: "Dashboard",
      description: "Tổng quan hoạt động cửa hàng",
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/customers",
      icon: <TeamOutlined />,
      title: "Khách hàng",
      description: "Quản lý tài khoản và lịch sử mua hàng",
      label: <Link to="/admin/customers">Quản lý khách hàng</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      title: "Sản phẩm",
      description: "Danh mục, giá bán và tồn kho sản phẩm",
      label: <Link to="/admin/products">Sản phẩm</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      title: "Đơn hàng",
      description: "Duyệt đơn, vận chuyển và trạng thái giao hàng",
      label: <Link to="/admin/orders">Đơn hàng</Link>,
    },

    {
      key: "/admin/inventory",
      icon: <InboxOutlined />,
      title: "Kho hàng",
      description: "Theo dõi nhập xuất và cảnh báo tồn kho",
      label: <Link to="/admin/inventory">Kho hàng</Link>,
    },

    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      title: "Thống kê",
      description: "Doanh thu, đơn hàng và hiệu suất hệ thống",
      label: <Link to="/admin/statistics">Thống kê</Link>,
    },
  ];

  const menuItems = navItems.map(({ key, icon, label }) => ({
    key,
    icon,
    label,
  }));

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

  const currentNavItem =
    [...navItems]
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) =>
        item.key === "/admin"
          ? location.pathname === "/admin"
          : location.pathname.startsWith(item.key),
      ) || navItems[0];

  const selectedKey = currentNavItem.key;

  const renderMenu = (
    <Menu
      className="admin-menu"
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={() => setMobileOpen(false)}
    />
  );

  return (
    <Layout className="admin-shell">
      {!isCompact && (
        <Sider
          width={268}
          collapsedWidth={86}
          collapsed={collapsed}
          trigger={null}
          className="admin-sider"
        >
          <div
            className={`admin-brand ${collapsed ? "admin-brand-collapsed" : ""}`}
          >
            <div className="admin-brand-mark">FA</div>
            {!collapsed && (
              <div className="admin-brand-copy">
                <strong>Fashion Admin</strong>
                <span>Control center</span>
              </div>
            )}
          </div>

          {renderMenu}
        </Sider>
      )}

      <Drawer
        className="admin-mobile-drawer"
        title={
          <div className="admin-drawer-brand">
            <div className="admin-brand-mark">FA</div>
            <span>Fashion Admin</span>
          </div>
        }
        placement="left"
        width={292}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{
          header: {
            background: "#111827",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          },
          body: {
            padding: 0,
            background: "#111827",
          },
        }}
      >
        {renderMenu}
      </Drawer>

      <Layout className="admin-main">
        <Header className="admin-header">
          <Space size={14} className="admin-header-title">
            <Button
              className="admin-menu-button"
              type="text"
              icon={
                isCompact ? (
                  <MenuUnfoldOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                isCompact ? setMobileOpen(true) : setCollapsed((value) => !value)
              }
            />

            <div className="admin-header-copy">
              <div>{currentNavItem.title}</div>
              <span>{currentNavItem.description}</span>
            </div>
          </Space>

          <Dropdown menu={{ items: userItems }} trigger={["click"]}>
            <Space className="admin-user-menu">
              <Avatar icon={<UserOutlined />} className="admin-user-avatar" />
              <span className="admin-user-name">Admin</span>
            </Space>
          </Dropdown>
        </Header>

        <Content className="admin-content">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
