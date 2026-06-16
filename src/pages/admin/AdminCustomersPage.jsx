import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Drawer,
  Descriptions,
  Select,
  Modal,
  List,
  Timeline,
  Empty,
} from "antd";

import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusValue, setStatusValue] = useState("active");
  const [lockReason, setLockReason] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const getAuthHeaders = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const token = adminInfo?.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCustomers = async (keyword = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/admin/customers?search=${encodeURIComponent(
          keyword,
        )}`,
        getAuthHeaders(),
      );

      setCustomers(res.data.customers || []);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tải danh sách khách hàng",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (customerId) => {
    try {
      setDetailLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/admin/customers/${customerId}`,
        getAuthHeaders(),
      );

      setCustomerDetail(res.data);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tải chi tiết khách hàng",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = () => {
    fetchCustomers(searchText.trim());
  };

  const openDetail = async (customer) => {
    setDrawerOpen(true);
    setCustomerDetail(null);
    await fetchCustomerDetail(customer._id);
  };

  const openStatusModal = (customer) => {
    setSelectedCustomer(customer);
    setStatusValue(customer.status || "active");
    setLockReason(customer.lockReason || "");
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedCustomer) return;

    if (statusValue === "locked" && !lockReason.trim()) {
      message.warning("Vui lòng nhập lý do khóa tài khoản");
      return;
    }

    try {
      setSavingStatus(true);

      const res = await axios.put(
        `http://localhost:5000/api/admin/customers/${selectedCustomer._id}/status`,
        {
          status: statusValue,
          lockReason,
        },
        getAuthHeaders(),
      );

      message.success(res.data.message || "Cập nhật trạng thái thành công");

      setCustomers((prev) =>
        prev.map((item) =>
          item._id === selectedCustomer._id ? res.data.customer : item,
        ),
      );

      setStatusModalOpen(false);

      if (drawerOpen && selectedCustomer?._id) {
        fetchCustomerDetail(selectedCustomer._id);
      }
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái",
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const activeCustomers = customers.filter(
    (customer) => (customer.status || "active") === "active",
  ).length;

  const lockedCustomers = customers.filter(
    (customer) => customer.status === "locked",
  ).length;

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {record.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "Chưa cập nhật",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address) => address || "Chưa cập nhật",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        if (status === "locked") {
          return (
            <Tag color="red" icon={<LockOutlined />}>
              Tạm khóa
            </Tag>
          );
        }

        return (
          <Tag color="green" icon={<UnlockOutlined />}>
            Kích hoạt
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record)}>
            Chi tiết
          </Button>

          <Button
            type={record.status === "locked" ? "default" : "primary"}
            danger={record.status !== "locked"}
            icon={
              record.status === "locked" ? <UnlockOutlined /> : <LockOutlined />
            }
            onClick={() => openStatusModal(record)}
          >
            {record.status === "locked" ? "Mở khóa" : "Khóa"}
          </Button>
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text copyable>{id}</Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text strong style={{ color: "#ef4444" }}>
          {Number(price || 0).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="blue">{status || "pending"}</Tag>,
    },
    {
      title: "Ngày mua",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
  ];

  const customer = customerDetail?.customer;
  const orders = customerDetail?.orders || [];
  const logs = customerDetail?.logs || [];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 8 }}>
        Quản lý thông tin khách hàng
      </Title>

      <Text type="secondary">
        Quản trị viên hoặc nhân viên có thể xem danh sách khách hàng, lịch sử
        mua hàng và cập nhật trạng thái tài khoản.
      </Text>

      <Row gutter={[20, 20]} style={{ marginTop: 28, marginBottom: 28 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng khách hàng"
              value={customers.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Đang kích hoạt"
              value={activeCustomers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tạm khóa"
              value={lockedCustomers}
              prefix={<StopOutlined />}
              valueStyle={{ color: "#dc2626" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Danh sách khách hàng
          </Title>

          <Space>
            <Input
              placeholder="Tìm theo tên, email, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{
                width: 320,
                borderRadius: 10,
              }}
            />

            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Space>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={customers}
          loading={loading}
          pagination={{
            pageSize: 8,
          }}
          scroll={{
            x: 1100,
          }}
        />
      </Card>

      <Drawer
        title="Chi tiết khách hàng"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={900}
      >
        {detailLoading ? (
          <Text>Đang tải...</Text>
        ) : customer ? (
          <>
            <Descriptions
              bordered
              column={1}
              size="middle"
              title="Thông tin khách hàng"
            >
              <Descriptions.Item label="Họ tên">
                {customer.name}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {customer.email}
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {customer.phone || "Chưa cập nhật"}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">
                {customer.address || "Chưa cập nhật"}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {customer.status === "locked" ? (
                  <Tag color="red" icon={<LockOutlined />}>
                    Tạm khóa
                  </Tag>
                ) : (
                  <Tag color="green" icon={<UnlockOutlined />}>
                    Kích hoạt
                  </Tag>
                )}
              </Descriptions.Item>

              {customer.status === "locked" && (
                <Descriptions.Item label="Lý do khóa">
                  {customer.lockReason || "Không có"}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Button
              type="primary"
              danger={customer.status !== "locked"}
              icon={
                customer.status === "locked" ? (
                  <UnlockOutlined />
                ) : (
                  <LockOutlined />
                )
              }
              style={{ marginTop: 18 }}
              onClick={() => openStatusModal(customer)}
            >
              {customer.status === "locked"
                ? "Kích hoạt tài khoản"
                : "Tạm khóa tài khoản"}
            </Button>

            <Title level={4} style={{ marginTop: 32 }}>
              <ShoppingCartOutlined /> Lịch sử mua hàng
            </Title>

            <Table
              rowKey="_id"
              columns={orderColumns}
              dataSource={orders}
              pagination={{
                pageSize: 5,
              }}
              locale={{
                emptyText: "Khách hàng chưa có đơn hàng",
              }}
            />

            <Title level={4} style={{ marginTop: 32 }}>
              Log thay đổi trạng thái
            </Title>

            {logs.length > 0 ? (
              <Timeline
                items={logs.map((log) => ({
                  color: log.newStatus === "locked" ? "red" : "green",
                  children: (
                    <div>
                      <Text strong>
                        {log.action === "LOCK_CUSTOMER"
                          ? "Tạm khóa tài khoản"
                          : log.action === "UNLOCK_CUSTOMER"
                            ? "Kích hoạt tài khoản"
                            : "Cập nhật trạng thái"}
                      </Text>

                      <br />

                      <Text type="secondary">
                        Người thực hiện: {log.changedBy?.name || "Không rõ"} -{" "}
                        {log.changedBy?.role || ""}
                      </Text>

                      <br />

                      <Text>
                        {log.oldStatus} → {log.newStatus}
                      </Text>

                      <br />

                      <Text>Lý do: {log.reason || "Không có"}</Text>

                      <br />

                      <Text type="secondary">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Empty description="Chưa có log thay đổi" />
            )}
          </>
        ) : (
          <Empty description="Không có dữ liệu khách hàng" />
        )}
      </Drawer>

      <Modal
        title="Cập nhật trạng thái khách hàng"
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        onOk={handleUpdateStatus}
        confirmLoading={savingStatus}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Khách hàng</Text>
          <br />
          <Text>{selectedCustomer?.name}</Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Trạng thái</Text>

          <Select
            value={statusValue}
            onChange={(value) => setStatusValue(value)}
            style={{ width: "100%", marginTop: 8 }}
            options={[
              {
                value: "active",
                label: "Kích hoạt",
              },
              {
                value: "locked",
                label: "Tạm khóa",
              },
            ]}
          />
        </div>

        {statusValue === "locked" && (
          <div>
            <Text strong>Lý do khóa</Text>

            <TextArea
              rows={4}
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              placeholder="Nhập lý do tạm khóa tài khoản khách hàng..."
              style={{ marginTop: 8 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCustomersPage;
