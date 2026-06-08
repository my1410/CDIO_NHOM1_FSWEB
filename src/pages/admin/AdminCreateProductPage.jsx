import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  message,
  Row,
  Col,
  Image,
  Tag,
  Divider,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  PictureOutlined,
  AppstoreOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const AdminCreateProductPage = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [imageText, setImageText] = useState("");

  const previewImages = useMemo(() => {
    return imageText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [imageText]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        images: values.images
          ? values.images
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        category: values.category,
        gender: values.gender,
        isSale: values.isSale || false,
        discount: values.isSale ? values.discount || 0 : 0,
        sizes: values.sizes
          ? values.sizes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        colors: values.colors
          ? values.colors
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        countInStock: values.countInStock,
        rating: values.rating || 0,
        numReviews: 0,
      };

      const res = await axios.post(
        "http://localhost:5000/api/products",
        productData,
      );

      message.success(res.data.message || "Thêm sản phẩm thành công");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const sectionTitleStyle = {
    margin: 0,
    color: "#111827",
    fontSize: 18,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  return (
    <div>
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginBottom: 24,
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #eff6ff 100%)",
          boxShadow: "0 14px 40px rgba(15,23,42,0.06)",
        }}
        bodyStyle={{ padding: 30 }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin/products")}
              style={{
                marginBottom: 18,
                borderRadius: 12,
                height: 40,
              }}
            >
              Quay lại danh sách
            </Button>

            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 40,
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: -0.8,
              }}
            >
              Thêm sản phẩm mới
            </h1>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                color: "#4b5563",
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 720,
              }}
            >
              Tạo sản phẩm mới cho Fashion AI Store. Hãy nhập đầy đủ thông tin,
              hình ảnh, tồn kho và phân loại để sản phẩm hiển thị đúng ở trang
              người dùng.
            </p>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                background: "#111827",
                color: "#fff",
              }}
              bodyStyle={{ padding: 22 }}
            >
              <div style={{ color: "#93c5fd", fontWeight: 700 }}>
                PRODUCT STATUS
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                Draft
              </div>

              <p
                style={{
                  color: "#cbd5e1",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                Sản phẩm sẽ được lưu vào MongoDB sau khi bấm “Lưu sản phẩm”.
              </p>
            </Card>
          </Col>
        </Row>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: "ao",
          gender: "unisex",
          isSale: false,
          discount: 0,
          countInStock: 0,
          rating: 0,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <h2 style={sectionTitleStyle}>
                <AppstoreOutlined />
                Thông tin cơ bản
              </h2>

              <Divider />

              <Form.Item
                label={<b>Tên sản phẩm</b>}
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Ví dụ: Áo Hoodie Premium"
                  style={{ height: 48, borderRadius: 12 }}
                />
              </Form.Item>

              <Form.Item
                label={<b>Mô tả</b>}
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>
            </Card>

            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <h2 style={sectionTitleStyle}>
                <DollarOutlined />
                Giá bán & kho hàng
              </h2>

              <Divider />

              <Row gutter={[18, 18]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<b>Giá</b>}
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                  >
                    <InputNumber
                      size="large"
                      min={0}
                      style={{ width: "100%", height: 48 }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="450000"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<b>Tồn kho</b>}
                    name="countInStock"
                    rules={[
                      { required: true, message: "Vui lòng nhập tồn kho" },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      min={0}
                      style={{ width: "100%", height: 48 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label={<b>Rating ban đầu</b>} name="rating">
                    <InputNumber
                      size="large"
                      min={0}
                      max={5}
                      step={0.1}
                      style={{ width: "100%", height: 48 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label={<b>Sale</b>}
                    name="isSale"
                    valuePropName="checked"
                  >
                    <Switch
                      checked={isSale}
                      onChange={(checked) => {
                        setIsSale(checked);
                        form.setFieldValue("isSale", checked);

                        if (!checked) {
                          form.setFieldValue("discount", 0);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                {isSale && (
                  <Col xs={24} md={8}>
                    <Form.Item label={<b>Giảm giá (%)</b>} name="discount">
                      <InputNumber
                        size="large"
                        min={0}
                        max={100}
                        style={{ width: "100%", height: 48 }}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>

            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <h2 style={sectionTitleStyle}>Phân loại sản phẩm</h2>

              <Divider />

              <Row gutter={[18, 18]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<b>Danh mục</b>}
                    name="category"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục" },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      options={[
                        { label: "Áo", value: "ao" },
                        { label: "Quần", value: "quan" },
                        { label: "Giày", value: "giay" },
                        { label: "Phụ kiện", value: "phu-kien" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<b>Giới tính</b>}
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      options={[
                        { label: "Nam", value: "men" },
                        { label: "Nữ", value: "women" },
                        { label: "Unisex", value: "unisex" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<b>Sizes</b>}
                    name="sizes"
                    extra="Nhập cách nhau bằng dấu phẩy. Ví dụ: S,M,L,XL hoặc 39,40,41"
                  >
                    <Input
                      size="large"
                      placeholder="S,M,L,XL"
                      style={{ height: 48, borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<b>Màu sắc</b>}
                    name="colors"
                    extra="Nhập cách nhau bằng dấu phẩy. Ví dụ: Đen,Trắng,Xanh"
                  >
                    <Input
                      size="large"
                      placeholder="Đen,Trắng,Xanh"
                      style={{ height: 48, borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 24,
                marginBottom: 24,
                boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
                position: "sticky",
                top: 100,
              }}
              bodyStyle={{ padding: 28 }}
            >
              <h2 style={sectionTitleStyle}>
                <PictureOutlined />
                Hình ảnh
              </h2>

              <Divider />

              <Form.Item
                label={<b>Link hình ảnh</b>}
                name="images"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ít nhất 1 link hình ảnh",
                  },
                ]}
                extra="Mỗi link ảnh nằm trên một dòng"
              >
                <TextArea
                  rows={6}
                  placeholder={`https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-...`}
                  value={imageText}
                  onChange={(e) => {
                    setImageText(e.target.value);
                    form.setFieldValue("images", e.target.value);
                  }}
                  style={{ borderRadius: 12 }}
                />
              </Form.Item>

              <div style={{ marginTop: 18 }}>
                <b style={{ color: "#111827" }}>Preview</b>

                {previewImages.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 12,
                      marginTop: 14,
                    }}
                  >
                    {previewImages.slice(0, 4).map((url, index) => (
                      <div
                        key={index}
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          background: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Image
                          src={url}
                          height={140}
                          width="100%"
                          style={{
                            objectFit: "cover",
                          }}
                          fallback="https://placehold.co/400x400?text=Fashion+AI"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 14,
                      border: "1px dashed #cbd5e1",
                      borderRadius: 18,
                      minHeight: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8fafc",
                      color: "#64748b",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Dán link ảnh để xem preview sản phẩm
                  </div>
                )}
              </div>

              <Divider />

              <div style={{ marginBottom: 16 }}>
                <Tag color="blue">Admin</Tag>
                <Tag color="green">MongoDB</Tag>
                <Tag color={isSale ? "red" : "default"}>
                  {isSale ? "Sale" : "Normal"}
                </Tag>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<SaveOutlined />}
                style={{
                  height: 52,
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                Lưu sản phẩm
              </Button>

              <Button
                size="large"
                block
                onClick={() => navigate("/admin/products")}
                style={{
                  marginTop: 12,
                  height: 48,
                  borderRadius: 14,
                  fontWeight: 700,
                }}
              >
                Hủy
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AdminCreateProductPage;
