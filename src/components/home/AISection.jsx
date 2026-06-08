import { Row, Col, Card, Tag } from "antd";

const AISection = () => {
  return (
    <div
      style={{
        marginBottom: 100,
      }}
    >
      <div
        style={{
          background: "#111827",
          borderRadius: 30,
          padding: 50,
        }}
      >
        <Row align="middle">
          <Col xs={24} md={12}>
            <Tag color="blue">AI Fashion</Tag>

            <h1
              style={{
                color: "#fff",
                fontSize: 50,
                marginTop: 20,
              }}
            >
              AI Outfit Recommendation
            </h1>

            <p
              style={{
                color: "#d1d5db",
                fontSize: 18,
                marginTop: 20,
                lineHeight: 1.8,
              }}
            >
              Hệ thống AI phân tích phong cách và đề xuất outfit phù hợp dành
              riêng cho bạn.
            </p>
          </Col>

          <Col xs={24} md={12}>
            <Card
              style={{
                borderRadius: 20,
              }}
            >
              <h2>AI Gợi Ý</h2>

              <p>Hoodie + Cargo Pants + Sneaker trắng</p>

              <p>Minimal style đang phù hợp với bạn.</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AISection;
