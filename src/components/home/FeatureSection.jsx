import { Row, Col, Card } from "antd";

const features = [
  {
    title: "Miễn phí vận chuyển",
    desc: "Cho đơn hàng trên 500k",
  },

  {
    title: "AI Tư vấn outfit",
    desc: "Gợi ý phong cách bằng AI",
  },

  {
    title: "Đổi trả dễ dàng",
    desc: "Trong vòng 7 ngày",
  },
];

const FeatureSection = () => {
  return (
    <Row
      gutter={[20, 20]}
      style={{
        marginTop: 50,
        marginBottom: 70,
      }}
    >
      {features.map((item, index) => (
        <Col xs={24} md={8} key={index}>
          <Card
            style={{
              borderRadius: 20,
              textAlign: "center",
              padding: 20,
              height: "100%",
            }}
          >
            <h2>{item.title}</h2>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              {item.desc}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default FeatureSection;
