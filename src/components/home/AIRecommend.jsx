import { useState } from "react";
import { Card, Row, Col, Tag, Input, Button, Spin, message } from "antd";
import { SparklesOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import ProductCard from "../product/ProductCard"; // Import thẻ sản phẩm chúng ta vừa chuẩn hóa

const AIRecommend = () => {
  const [styleInput, setStyleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // Lưu kết quả trả về từ Gemini

  const handleAiAnalyze = async () => {
    if (!styleInput.trim()) {
      return message.warning(
        "Hãy nhập gu thời trang hoặc hoàn cảnh bạn muốn phối đồ nhé!",
      );
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/ai/recommend",
        { stylePreferences: styleInput },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (response.data.success) {
        setAiResult({
          feedback: response.data.aiFeedback,
          products: response.data.recommendedProducts || [],
        });
        message.success("Fashion AI đã phối đồ xong cho bạn! 👇");
      }
    } catch (error) {
      console.error("Lỗi gọi AI trang chủ:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Hệ thống AI bận hoặc yêu cầu Đăng nhập!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 60, marginBottom: 60, padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 25,
        }}
      >
        <SparklesOutlined style={{ fontSize: 28, color: "#1677ff" }} />
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          Trợ lý Phối đồ Fashion AI
        </h2>
      </div>

      {/* KHU VỰC NHẬP GU THỜI TRANG */}
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          border: "none",
          marginBottom: 30,
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: "#4b5563",
            marginBottom: 15,
            fontWeight: 500,
          }}
        >
          Hôm nay bạn muốn mặc gì? Hãy nói cho AI biết hoàn cảnh (đi tiệc, đi
          học, hẹn hò) hoặc phong cách bạn muốn hướng tới:
        </p>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          <Input
            size="large"
            placeholder="Ví dụ: Phối cho mình một outfit đi uống cafe cuối tuần nhẹ nhàng, thoải mái..."
            value={styleInput}
            onChange={(e) => setStyleInput(e.target.value)}
            onPressEnter={handleAiAnalyze}
            disabled={loading}
            style={{ flex: 1, height: 50, borderRadius: 12 }}
          />
          <Button
            type="primary"
            size="large"
            icon={<SparklesOutlined />}
            onClick={handleAiAnalyze}
            loading={loading}
            style={{
              height: 50,
              borderRadius: 12,
              fontWeight: 600,
              padding: "0 25px",
            }}
          >
            Phân tích phối đồ
          </Button>
        </div>
      </Card>

      {/* HIỆU ỨNG LOADING CHỜ AI XỬ LÝ */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            tip="Fashion AI đang lục kho đồ và phối outfit cho bạn..."
          />
        </div>
      )}

      {/* KHU VỰC HIỂN THỊ KẾT QUẢ TỪ BỘ NÃO AI */}
      {aiResult && !loading && (
        <Row gutter={[30, 30]}>
          {/* Cột trái: Lời khuyên văn bản chi tiết từ Gemini */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tag
                    color="geekblue"
                    style={{ fontSize: 13, padding: "2px 8px" }}
                  >
                    Stylist AI khuyên bạn
                  </Tag>
                </div>
              }
              style={{
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                border: "none",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "#374151",
                  whiteSpace: "pre-line", // Giúp các dấu ngắt dòng (\n) của Gemini hiển thị đẹp đẽ
                }}
              >
                {aiResult.feedback}
              </div>
            </Card>
          </Col>

          {/* Cột phải: Khối render các sản phẩm thực tế được gợi ý */}
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 15 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
                🛒 Gợi ý các sản phẩm có sẵn trong tủ đồ CODE_FASHION:
              </h3>
            </div>
            <Row gutter={[20, 20]}>
              {aiResult.products.map((prod) => (
                <Col xs={24} sm={12} key={prod._id}>
                  {/* Tái sử dụng Component ProductCard xịn mịn của bạn */}
                  <ProductCard product={prod} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AIRecommend;
