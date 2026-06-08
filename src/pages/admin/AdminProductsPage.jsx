import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Image,
  Input,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const AdminProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products");

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/products/${id}`,
      );
      message.success(res.data.message);
      fetchProducts();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      width: 100,
      fixed: "left",
      render: (images) => (
        <Image
          width={64}
          height={64}
          style={{
            objectFit: "cover",
            borderRadius: 10,
            background: "#f3f4f6",
          }}
          src={images?.[0] || "https://placehold.co/200x200?text=Fashion+AI"}
          fallback="https://placehold.co/200x200?text=Fashion+AI"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",
      render: (text) => (
        <b style={{ color: "#111827", lineHeight: 1.5 }}>{text}</b>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: 120,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: 120,
      render: (gender) => (
        <Tag
          color={
            gender === "men"
              ? "geekblue"
              : gender === "women"
                ? "magenta"
                : "green"
          }
        >
          {gender}
        </Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 140,
      render: (price) => (
        <b style={{ color: "#ef4444" }}>
          {(price || 0).toLocaleString("vi-VN")}đ
        </b>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      width: 100,
    },
    {
      title: "Sale",
      width: 100,
      render: (_, record) =>
        record.isSale ? (
          <Tag color="red">-{record.discount || 0}%</Tag>
        ) : (
          <Tag>Không</Tag>
        ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      width: 110,
      render: (rating) => rating || 0,
    },
    {
      title: "Hành động",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${record._id}`)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa sản phẩm?"
            description="Bạn chắc chắn muốn xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <Card
        style={{
          borderRadius: 20,
          border: "none",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
        bodyStyle={{
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              Quản lý sản phẩm
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: 8,
                marginBottom: 0,
                fontSize: 15,
              }}
            >
              Tổng số: <b>{products.length}</b> sản phẩm
            </p>
          </div>

          <Space wrap>
            <Input
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{
                width: 260,
                height: 40,
              }}
            />

            <Button icon={<ReloadOutlined />} onClick={fetchProducts}>
              Làm mới
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/admin/products/create")}
            >
              Thêm sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={filteredProducts}
          scroll={{ x: 1250 }}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminProductsPage;
